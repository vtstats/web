import { CommonModule } from "@angular/common";
import { Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { startOfHour, subDays } from "date-fns";
import { type ECharts } from "echarts";
import qs from "query-string";

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
  ],
  selector: "hls-channel-overview",
  templateUrl: "channel-overview.html",
})
export class ChannelOverview implements OnInit {
  private qry = inject(QryService);
  private ngZone = inject(NgZone);

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

  _precision: number = 7;

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

  charts: ECharts[] = [];
  currentIndex: number = -1;

  onChartInit(ec: ECharts) {
    this.ngZone.runOutsideAngular(() => {
      this.charts.push(ec);

      ec.getZr().on("mouseout", () => {
        if (this.currentIndex != -1) {
          this.currentIndex = -1;
          this.charts.forEach((c) => {
            c.dispatchAction({ type: "hideTip" });
          });
        }
      });

      ec.getZr().on("mousemove", (params: any) => {
        const pointerData = ec.convertFromPixel("grid", [
          params.event.offsetX,
          params.event.offsetY,
        ]);

        const dataIndex = pointerData[0];

        if (dataIndex !== this.currentIndex) {
          this.currentIndex = dataIndex;
          this.charts.forEach((c) => {
            c.dispatchAction({
              type: "showTip",
              seriesIndex: 0,
              dataIndex: pointerData[0],
            });
          });
        }
      });
    });
  }
}
