import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MultiSeries } from "@swimlane/ngx-charts";
import { format, parseISO } from "date-fns";

import { ChannelReportResponse, VTuber } from "src/app/models";

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "./vtubers-detail.component.html",
  styleUrls: ["./vtubers-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VTubersDetailComponent {
  constructor(private route: ActivatedRoute) {}

  vtuber: VTuber;
  vtuberId: string;

  bilibiliSubs: MultiSeries = [];
  bilibiliViews: MultiSeries = [];
  youtubeSubs: MultiSeries = [];
  youtubeViews: MultiSeries = [];

  ngOnInit() {
    this.vtuberId = this.route.snapshot.paramMap.get("id");

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

  dateFormatting(date: Date): string {
    return format(date, "MM/dd");
  }
}
