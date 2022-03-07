import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { startOfHour, subDays } from "date-fns";
import { BehaviorSubject, map, Observable, startWith, switchMap } from "rxjs";
import { flatRollup, max, range } from "d3-array";

import { ChannelReportKind, Report, VTuber } from "src/app/models";
import { ApiService } from "src/app/shared";

@Component({
  selector: "hls-channel-overview",
  templateUrl: "channel-overview.html",
  styleUrls: ["channel-overview.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelOverview implements OnInit {
  constructor(private api: ApiService) {}

  dataPointIdx = -1;

  @Input() vtuber: VTuber;

  get shimmers(): Array<any> {
    return this.vtuber.youtube && this.vtuber.bilibili ? Array(4) : Array(2);
  }

  loading = false;

  reports: Report<ChannelReportKind>[];

  precision$ = new BehaviorSubject<7 | 30 | 90>(30);
  res$: Observable<{
    precision: number;
    reports: Report<ChannelReportKind>[];
    loading: boolean;
  }>;

  ngOnInit() {
    this.loading = true;

    const now = startOfHour(Date.now());

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

    this.res$ = this.precision$.pipe(
      switchMap((precision) =>
        this.api
          .channelReports({
            ids: [this.vtuber.id],
            metrics,
            startAt: subDays(now, precision),
            endAt: now,
          })
          .pipe(
            map((res) =>
              res.reports.map((report) => {
                const step = {
                  7: 43200 * 1000, // 12 hours
                  30: 2 * 86400 * 1000, // 2 days
                  90: 6 * 86400 * 1000, // 6 days
                }[precision];

                report.rows = flatRollup(
                  report.rows,
                  (rows) => max(rows, (row) => row[1]),
                  (row) => row[0] - (row[0] % step)
                );

                return report;
              })
            ),
            map((reports) => ({
              precision,
              loading: false,
              reports,
            })),
            startWith({
              precision,
              loading: true,
              reports: metrics.map((m) => ({
                id: "",
                kind: m,
                rows: range(0, { 7: 14, 30: 16, 90: 16 }[precision]).map(
                  (i) => [i, 0] as [number, number]
                ),
              })),
            })
          )
      )
    );
  }
}
