import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MultiSeries } from "@swimlane/ngx-charts";
import { format, parseISO } from "date-fns";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import * as vtubers from "vtubers";

import { Stream, StreamReportResponse } from "../models";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "./streams-detail.component.html",
  styleUrls: ["./streams-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class StreamsDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  stream: Stream;
  stats: MultiSeries = [];
  streamId: string;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));

  ngOnInit() {
    const res: StreamReportResponse = this.route.snapshot.data.data;
    this.streamId = this.route.snapshot.paramMap.get("id");

    if (
      res.reports.length > 0 &&
      res.reports[0].kind == "youtube_stream_viewer"
    ) {
      this.stats.push({
        name: "",
        series: res.reports[0].rows.map(([name, value]) => ({
          name: parseISO(name),
          value
        }))
      });
    }

    if (res.streams.length > 0) {
      this.stream = res.streams[0];
    }
  }

  dateTickFormatting(val: Date): string {
    return format(val, "HH:mm");
  }

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const member of item.members) {
        if (member.id == id) return member;
      }
    }
  }
}
