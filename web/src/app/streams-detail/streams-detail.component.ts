import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { parseISO } from "date-fns";
import type { MultiSeries } from "@swimlane/ngx-charts";

import { Stream } from "../models";
import { ApiService } from "../services";
import { TickService } from "../shared/tick.service";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "./streams-detail.component.html",
})
export class StreamsDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private tickService: TickService
  ) {}

  streamId = this.route.snapshot.paramMap.get("id");
  everySecond$ = this.tickService.everySecond$;

  loading = false;
  stream: Stream;
  stats: MultiSeries = [];

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
            name: parseISO(name),
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
