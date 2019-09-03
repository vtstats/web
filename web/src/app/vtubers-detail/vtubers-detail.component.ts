import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getUnixTime, format, fromUnixTime, startOfToday } from "date-fns";
import { switchMap } from "rxjs/operators";

import { VTuber } from "@holostats/libs/models";

import { ApiService } from "../services";

const today = getUnixTime(startOfToday());

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "./vtubers-detail.component.html",
  styleUrls: ["./vtubers-detail.component.scss"]
})
export class VTubersDetailComponent {
  xAxisTicks = [];
  xScaleMin = 0;

  bilibiliSubs = [];
  bilibiliViews = [];
  youtubeSubs = [];
  youtubeViews = [];

  vtuber: VTuber;

  constructor(private service: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.xAxisTicks = this.createTicks([0, 1, 2, 3, 4, 5, 6]);
    this.xScaleMin = this.xAxisTicks[this.xAxisTicks.length - 1];
    this.route.paramMap
      .pipe(switchMap(params => this.service.getVTuberStat(params.get("id"))))
      .subscribe(vtuber => {
        let youtubeSubsSeries = [];
        let youtubeViewsSeries = [];
        let bilibiliSubsSeries = [];
        let bilibiliViewsSeries = [];
        for (const [name, values] of Object.entries(vtuber.stats)) {
          youtubeSubsSeries.push({ name: parseInt(name), value: values[0] });
          youtubeViewsSeries.push({ name: parseInt(name), value: values[1] });
          bilibiliSubsSeries.push({ name: parseInt(name), value: values[2] });
          bilibiliViewsSeries.push({ name: parseInt(name), value: values[3] });
        }
        this.youtubeSubs.push({ name: "", series: youtubeSubsSeries });
        this.youtubeViews.push({ name: "", series: youtubeViewsSeries });
        this.bilibiliSubs.push({ name: "", series: bilibiliSubsSeries });
        this.bilibiliViews.push({ name: "", series: bilibiliViewsSeries });
        this.vtuber = vtuber;
      });
  }

  dateTickFormatting(val: number): string {
    return format(fromUnixTime(val), "MM/dd");
  }

  numTickFormatting(num: number): string {
    return num.toLocaleString();
  }

  createTicks(days: number[]): number[] {
    return days.map(d => today - d * 24 * 60 * 60);
  }
}
