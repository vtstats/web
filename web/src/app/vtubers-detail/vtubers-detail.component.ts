import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { format, fromUnixTime, getUnixTime, startOfToday } from "date-fns";
import * as vtubers from "vtubers";

import { VTuberResponse } from "../models";

type YouTubeStats = VTuberResponse["vtuber"]["youtubeStats"];
type BilibiliStats = VTuberResponse["vtuber"]["bilibiliStats"];

const today = getUnixTime(startOfToday());

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "./vtubers-detail.component.html",
  styleUrls: ["./vtubers-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VTubersDetailComponent {
  constructor(private route: ActivatedRoute) {}

  vtuber;
  xAxisTicks = [];
  xScaleMin = 0;

  bilibiliSubs = [];
  bilibiliViews = [];
  youtubeSubs = [];
  youtubeViews = [];

  bilibiliStats: BilibiliStats;
  youtubeStats: YouTubeStats;

  ngOnInit() {
    this.vtuber = this.findVTuber(this.route.snapshot.paramMap.get("id"));

    const res: VTuberResponse = this.route.snapshot.data.data;

    this.xAxisTicks = this.createTicks([0, 1, 2, 3, 4, 5, 6]);
    this.xScaleMin = this.xAxisTicks[this.xAxisTicks.length - 1];
    const youtubeSubsSeries = [];
    const youtubeViewsSeries = [];
    const bilibiliSubsSeries = [];
    const bilibiliViewsSeries = [];

    for (const [name, values] of Object.entries(res.series)) {
      youtubeSubsSeries.push({ name: parseInt(name), value: values[0] });
      youtubeViewsSeries.push({ name: parseInt(name), value: values[1] });
      bilibiliSubsSeries.push({ name: parseInt(name), value: values[2] });
      bilibiliViewsSeries.push({ name: parseInt(name), value: values[3] });
    }

    this.youtubeSubs.push({ name: "", series: youtubeSubsSeries });
    this.youtubeViews.push({ name: "", series: youtubeViewsSeries });
    this.bilibiliSubs.push({ name: "", series: bilibiliSubsSeries });
    this.bilibiliViews.push({ name: "", series: bilibiliViewsSeries });

    this.youtubeStats = res.vtuber.youtubeStats;
    this.bilibiliStats = res.vtuber.bilibiliStats;
  }

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const vtuber of item.members) {
        if (vtuber.id == id) return vtuber;
      }
    }
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
