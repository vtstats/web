import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { format, fromUnixTime } from "date-fns";
import { switchMap, map } from "rxjs/operators";
import { timer } from "rxjs";

import { Stream } from "@holostats/libs/models";
import { VTUBERS } from "@holostats/libs/const";

import { ApiService } from "../services";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "./streams-detail.component.html",
  styleUrls: ["./streams-detail.component.scss"]
})
export class StreamsDetailComponent implements OnInit {
  constructor(private service: ApiService, private route: ActivatedRoute) {}

  vtubers = VTUBERS;
  stream: Stream;
  stats = [];

  xAxisTicks = [];
  xScaleMax = 0;
  xScaleMin = 0;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap(params => this.service.getStreamStat(params.get("id"))))
      .subscribe(res => {
        const series = Object.entries(res.stats).map(([name, value]) => ({
          value,
          name: parseInt(name)
        }));
        this.xAxisTicks = this.createTicks(
          series[0].name,
          series[series.length - 1].name
        );
        this.xScaleMin = series[0].name;
        this.xScaleMax = series[series.length - 1].name;
        this.stream = res;
        this.stats.push({ name: "viewerStats", series });
      });
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
    return this.vtubers.find(v => v.id == id);
  }
}
