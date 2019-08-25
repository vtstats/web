import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  subDays,
  getUnixTime,
  format,
  fromUnixTime,
  startOfToday
} from "date-fns";
import { VTuberStats } from "@holostats/libs/models";

import { ApiService } from "../services";
import { switchMap } from "rxjs/operators";

const today = startOfToday();

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "./vtubers-detail.component.html",
  styleUrls: ["./vtubers-detail.component.scss"]
})
export class VTubersDetailComponent {
  xAxisTicks = [
    getUnixTime(subDays(today, 4)),
    getUnixTime(subDays(today, 3)),
    getUnixTime(subDays(today, 2)),
    getUnixTime(subDays(today, 1)),
    getUnixTime(today)
  ];

  bilibiliSubs = [];
  bilibiliViews = [];
  youtubeSubs = [];
  youtubeViews = [];

  vtuber: VTuberStats;

  constructor(private service: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap(params => this.service.getVTuberStat(params.get("id"))))
      .subscribe(v => {
        this.updateSeriesData("bilibiliSubs", v);
        this.updateSeriesData("youtubeSubs", v);
        this.updateSeriesData("bilibiliViews", v);
        this.updateSeriesData("youtubeViews", v);
        this.vtuber = v;
      });
  }

  updateSeriesData(path: string, vtuber: VTuberStats) {
    this[path].push({
      name: path,
      series: Object.entries(vtuber[path]).map(([name, value]) => ({
        value,
        name: parseInt(name)
      }))
    });
  }

  dateTickFormatting(val: number): string {
    return format(fromUnixTime(val), "MM/dd");
  }

  numTickFormatting(num: number): string {
    return num.toLocaleString();
  }
}
