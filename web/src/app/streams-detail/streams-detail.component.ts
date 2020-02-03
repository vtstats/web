import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MultiSeries } from "@swimlane/ngx-charts";
import { differenceInSeconds, format, parseISO, subSeconds } from "date-fns";
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

  xAxisTicks: Date[] = [];
  xScaleMax: Date;
  xScaleMin: Date;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));

  ngOnInit() {
    const res: StreamReportResponse = this.route.snapshot.data.data;
    this.streamId = this.route.snapshot.paramMap.get("id");

    if (
      res.reports.length > 0 &&
      res.reports[0].kind == "youtube_stream_viewer"
    ) {
      const series = res.reports[0].rows.map(([name, value]) => ({
        name: parseISO(name),
        value
      }));
      this.xAxisTicks = this.createTicks(
        series[0].name,
        series[series.length - 1].name
      );
      this.xScaleMin = series[0].name;
      this.xScaleMax = series[series.length - 1].name;
      this.stats = [{ name: "", series }];
    }

    if (res.streams.length > 0) {
      this.stream = res.streams[0];
    }
  }

  dateTickFormatting(val: Date): string {
    return format(val, "HH:mm");
  }

  createTicks(start: Date, end: Date): Date[] {
    const seconds = differenceInSeconds(end, start);
    const step = seconds > 600 ? Math.ceil(seconds / 10) : 60;
    const results = [start];
    for (let i = end; i > start; i = subSeconds(i, step)) {
      results.push(i);
    }
    return results;
  }

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const member of item.members) {
        if (member.id == id) return member;
      }
    }
  }
}
