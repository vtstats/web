import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { startOfHour, subDays } from "date-fns";
import qs from "query-string";

import { Menu } from "src/app/components/menu/menu";
import {
  ChannelReportKind,
  ChannelReportResponse,
  Report,
  VTuber,
} from "src/app/models";
import { ThemeService } from "src/app/shared/config/theme.service";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { FormatDayDurationPipe } from "./format-day-duration-pipe/format-day-duration-pipe";
import { StatsChartComponent } from "./stats-chart/stats-chart.component";
import { StatsComparisonComponent } from "./stats-comparison/stats-comparison.component";

@Component({
  standalone: true,
  imports: [
    FormatDayDurationPipe,
    CommonModule,
    MatDividerModule,
    StatsChartComponent,
    StatsComparisonComponent,
    UseQryPipe,
    Menu,
  ],
  selector: "hls-channel-overview",
  templateUrl: "channel-overview.html",
})
export class ChannelOverview implements OnInit {
  private qry = inject(QryService);

  theme$ = inject(ThemeService).theme$;

  @Input() vtuber: VTuber;

  get shimmers(): Array<any> {
    return this.vtuber.youtube && this.vtuber.bilibili ? Array(4) : Array(2);
  }

  streamReportsQry: Qry<
    ChannelReportResponse,
    unknown,
    ChannelReportResponse,
    ChannelReportResponse,
    [string, { startAt: number; endAt: number }, string]
  >;

  private _precision: number = 7;

  get precision(): number {
    return this._precision;
  }
  set precision(p: number) {
    this._precision = p;
    this.streamReportsQry.updateQueryKey([
      "channelReports",
      this._getDateRange(),
      this.vtuber.id,
    ]);
  }

  ngOnInit() {
    const metrics: ChannelReportKind[] = [];

    if (this.vtuber.youtube) {
      metrics.push(
        ChannelReportKind.youtubeChannelSubscriber,
        ChannelReportKind.youtubeChannelView
      );
    }

    if (this.vtuber.bilibili) {
      metrics.push(
        ChannelReportKind.bilibiliChannelSubscriber,
        ChannelReportKind.bilibiliChannelView
      );
    }

    this.streamReportsQry = this.qry.create({
      placeholderData: {
        channels: [],
        reports: metrics.map((m) => ({ id: "", kind: m, rows: [] })),
      },
      queryKey: ["channelReports", this._getDateRange(), this.vtuber.id],
      queryFn: ({ queryKey: [_, { startAt, endAt }, id] }) =>
        fetch(
          qs.stringifyUrl(
            {
              url: "https://holoapi.poi.cat/api/v4/channels_report",
              query: {
                ids: [id],
                metrics,
                startAt,
                endAt,
              },
            },
            { arrayFormat: "comma" }
          )
        ).then((res) => res.json()),
    });
  }

  _getDateRange(): { startAt: number; endAt: number } {
    const now = startOfHour(Date.now());

    const endAt = +now;
    const startAt = +subDays(now, this._precision);

    return { startAt, endAt };
  }

  trackBy(_: number, report: Report<ChannelReportKind>): string {
    return report.kind;
  }
}
