import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MultiSeries } from "@swimlane/ngx-charts";
import { format, parseISO } from "date-fns";

import * as vtubers from "vtubers";

import { ChannelReportResponse, VTuber } from "../models";

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "./vtubers-detail.component.html",
  styleUrls: ["./vtubers-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VTubersDetailComponent {
  constructor(private route: ActivatedRoute) {}

  vtuber: VTuber;

  bilibiliSubs: MultiSeries = [];
  bilibiliViews: MultiSeries = [];
  youtubeSubs: MultiSeries = [];
  youtubeViews: MultiSeries = [];

  ngOnInit() {
    this.vtuber = this.findVTuber(this.route.snapshot.paramMap.get("id"));

    const res: ChannelReportResponse = this.route.snapshot.data.data;

    for (const report of res.reports) {
      switch (report.kind) {
        case "youtube_channel_subscriber":
          this.youtubeSubs.push({
            name: "",
            series: report.rows.map(([name, value]) => ({
              name: parseISO(name),
              value
            }))
          });
          break;
        case "youtube_channel_view":
          this.youtubeViews.push({
            name: "",
            series: report.rows.map(([name, value]) => ({
              name: parseISO(name),
              value
            }))
          });
          break;
        case "bilibili_channel_subscriber":
          this.bilibiliSubs.push({
            name: "",
            series: report.rows.map(([name, value]) => ({
              name: parseISO(name),
              value
            }))
          });
          break;
        case "bilibili_channel_view":
          this.bilibiliViews.push({
            name: "",
            series: report.rows.map(([name, value]) => ({
              name: parseISO(name),
              value
            }))
          });
          break;
      }
    }
  }

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const vtuber of item.members) {
        if (vtuber.id == id) return vtuber;
      }
    }
  }

  dateFormatting(date: Date): string {
    return format(date, "MM/dd");
  }
}
