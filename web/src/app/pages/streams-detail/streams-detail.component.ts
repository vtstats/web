import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { parseISO } from "date-fns";
import type { MultiSeries } from "@swimlane/ngx-charts";

import { Stream } from "src/app/models";
import { ApiService, TickService } from "src/app/shared";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "./streams-detail.component.html",
})
export class StreamsDetailComponent implements OnInit {
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

    this.api.getStreamReport(this.streamId).subscribe((res) => {
      this.loading = false;

      if (res.streams.length > 0) {
        this.stream = res.streams[0];
      } else {
        this.router.navigateByUrl("/404");
        return;
      }

      this.title.setTitle(`${this.stream.title} | HoloStats`);

      if (
        res.reports.length > 0 &&
        res.reports[0].kind == "youtube_stream_viewer"
      ) {
        this.stats.push({
          name: "",
          series: res.reports[0].rows.map(([name, value]) => ({
            name: parseISO(name),
            value,
          })),
        });
      }
    });
  }
}
