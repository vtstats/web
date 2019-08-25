import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  subDays,
  getUnixTime,
  format,
  fromUnixTime,
  startOfToday
} from "date-fns";

import { ApiService } from "../services";
import { switchMap } from "rxjs/operators";
import { VTuberStats } from "@holostats/libs/models";

const today = startOfToday();

@Component({
  selector: "hs-subs-detail",
  templateUrl: "./subs-detail.component.html",
  styleUrls: ["./subs-detail.component.scss"]
})
export class SubsDetailComponent {
  view = [600, 200];

  xAxisTicks = [
    getUnixTime(subDays(today, 4)),
    getUnixTime(subDays(today, 3)),
    getUnixTime(subDays(today, 2)),
    getUnixTime(subDays(today, 1)),
    getUnixTime(today)
  ];

  youtubeColorScheme = { domain: ["#e00404"] };
  bilibiliColorScheme = { domain: ["#00a1d6"] };

  bilibiliSubStats = [];
  bilibiliViewStats = [];
  youtubeSubStats = [];
  youtubeViewStats = [];

  constructor(private service: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap(params => this.service.getVTuberStat(params.get("id"))))
      .subscribe(v => {
        this.updateSeriesData("bilibiliSubStats", v);
        this.updateSeriesData("youtubeSubStats", v);
        this.updateSeriesData("bilibiliViewStats", v);
        this.updateSeriesData("youtubeViewStats", v);
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

  numTickFormatting(num: number): string | number {
    return num > 999999
      ? (num / 1000000).toString() + "M"
      : num > 999
      ? (num / 1000).toString() + "K"
      : num;
  }
}
