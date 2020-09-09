import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { endOfToday, subDays, parseISO } from "date-fns";
import type { MultiSeries, DataItem } from "@swimlane/ngx-charts";

import { VTuber } from "src/app/models";
import { ApiService } from "src/app/services";

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "./vtubers-detail.component.html",
})
export class VTubersDetailComponent {
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  loading = false;

  vtuber: VTuber;
  vtuberId: string;

  bilibiliSubs: MultiSeries = [];
  bilibiliViews: MultiSeries = [];
  youtubeSubs: MultiSeries = [];
  youtubeViews: MultiSeries = [];

  ngOnInit() {
    this.loading = true;

    this.vtuberId = this.route.snapshot.paramMap.get("id");

    const end = endOfToday();

    this.apiService
      .getChannelReport(
        this.vtuberId,
        "youtube_channel_subscriber,youtube_channel_view,bilibili_channel_subscriber,bilibili_channel_view",
        subDays(end, 7),
        end
      )
      .subscribe((res) => {
        this.loading = false;

        for (const report of res.reports) {
          const series = this.generateSeries(report.rows);

          switch (report.kind) {
            case "youtube_channel_subscriber":
              this.youtubeSubs.push({ name: "", series });
              break;
            case "youtube_channel_view":
              this.youtubeViews.push({ name: "", series });
              break;
            case "bilibili_channel_subscriber":
              this.bilibiliSubs.push({ name: "", series });
              break;
            case "bilibili_channel_view":
              this.bilibiliViews.push({ name: "", series });
              break;
          }
        }
      });
  }

  generateSeries(rows: [string, number][]): DataItem[] {
    const res = [];
    let prev: number;

    for (const [name, value] of rows) {
      if (prev === undefined || prev !== value) {
        res.push({ name: parseISO(name), value });
        prev = value;
      }
    }

    return res;
  }
}
