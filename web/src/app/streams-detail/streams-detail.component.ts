import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import dayjs from "dayjs";
import { timer } from "rxjs";
import { map } from "rxjs/operators";
import type { MultiSeries } from "@swimlane/ngx-charts";

import { Stream } from "../models";
import { ApiService } from "../services";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "./streams-detail.component.html",
})
export class StreamsDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  streamId = this.route.snapshot.paramMap.get("id");

  loading = false;
  stream: Stream;
  stats: MultiSeries = [];

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));

  ngOnInit() {
    this.loading = true;

    this.apiService.getStreamReport(this.streamId).subscribe((res) => {
      this.loading = false;
      if (
        res.reports.length > 0 &&
        res.reports[0].kind == "youtube_stream_viewer"
      ) {
        this.stats.push({
          name: "",
          series: res.reports[0].rows.map(([name, value]) => ({
            name: dayjs(name).toDate(),
            value,
          })),
        });
      }

      if (res.streams.length > 0) {
        this.stream = res.streams[0];
      }
    });
  }
}
