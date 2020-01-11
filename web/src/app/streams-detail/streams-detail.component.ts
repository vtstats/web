import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { format, fromUnixTime } from "date-fns";
import { map } from "rxjs/operators";
import { timer } from "rxjs";

import * as vtubers from "vtubers";

import { Stream } from "../models";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "./streams-detail.component.html",
  styleUrls: ["./streams-detail.component.scss"]
})
export class StreamsDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  stream: Stream;
  stats = [];

  xAxisTicks = [];
  xScaleMax = 0;
  xScaleMin = 0;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));

  ngOnInit() {
    const series = Object.entries(this.route.snapshot.data.data.stats).map(
      ([name, value]) => ({
        value,
        name: parseInt(name)
      })
    );
    this.xAxisTicks = this.createTicks(
      series[0].name,
      series[series.length - 1].name
    );
    this.xScaleMin = series[0].name;
    this.xScaleMax = series[series.length - 1].name;
    this.stream = this.route.snapshot.data.data;
    this.stats = [{ name: "viewerStats", series }];
  }

  dateTickFormatting(val: number): string {
    return format(fromUnixTime(val), "HH:mm");
  }

  createTicks(start: number, end: number): number[] {
    const seconds = end - start;
    const step = seconds > 600 ? Math.ceil(seconds / 10) : 60;
    const results = [start];
    for (let i = end; i > start; i -= step) {
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
