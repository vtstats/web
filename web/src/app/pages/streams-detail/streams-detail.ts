import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Report, Stream, StreamReportKind } from "src/app/models";
import { ApiService, TickService } from "src/app/shared";

@Component({
  selector: "hls-streams-detail",
  templateUrl: "streams-detail.html",
  styleUrls: ["streams-detail.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamsDetail implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private tick: TickService
  ) {}

  streamId = this.route.snapshot.paramMap.get("id");
  everySecond$ = this.tick.everySecond$;

  loading = false;
  stream: Stream;
  reports: Report<StreamReportKind>[];

  ngOnInit() {
    this.loading = true;

    this.api
      .streamReports({
        ids: [this.streamId],
        metrics: [
          StreamReportKind.youtubeStreamViewer,
          StreamReportKind.youtubeLiveChatMessage,
        ],
      })
      .subscribe((res) => {
        this.loading = false;

        if (res.streams.length == 0) {
          this.router.navigateByUrl("/404");
          return;
        }

        this.stream = res.streams[0];
        this.reports = res.reports;
      });
  }
}
