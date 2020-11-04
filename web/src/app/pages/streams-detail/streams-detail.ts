import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import type { MultiSeries } from "@swimlane/ngx-charts";

import { Stream, StreamReportKind } from "src/app/models";
import { ApiService, TickService } from "src/app/shared";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "streams-detail.html",
})
export class StreamsDetail implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private tick: TickService,
    private title: Title
  ) {}

  streamId = this.route.snapshot.paramMap.get("id");
  everySecond$ = this.tick.everySecond$;

  loading = false;
  stream: Stream;
  stats: MultiSeries = [];

  ngOnInit() {
    this.loading = true;

    this.api
      .streamReports({
        ids: [this.streamId],
        metrics: [StreamReportKind.youtubeStreamViewer],
      })
      .subscribe((res) => {
        this.loading = false;

        if (res.streams.length > 0) {
          this.stream = res.streams[0];
        } else {
          this.router.navigateByUrl("/404");
          return;
        }

        this.title.setTitle(`${this.stream.title} | HoloStats`);

        if (res.reports?.[0].kind == StreamReportKind.youtubeStreamViewer) {
          this.stats.push({
            name: "",
            series: res.reports[0].rows.map(([date, value]) => ({
              name: new Date(date),
              value,
            })),
          });
        }
      });
  }
}
