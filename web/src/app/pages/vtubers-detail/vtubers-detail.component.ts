import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { endOfToday, subDays, parseISO } from "date-fns";
import type { MultiSeries, DataItem } from "@swimlane/ngx-charts";

import { vtubers } from "vtubers";

import { VTuber } from "src/app/models";
import { ApiService } from "src/app/shared";
import { LOCAL_NAMES, LocalNames } from "src/i18n/names";

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "./vtubers-detail.component.html",
})
export class VTubersDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private title: Title,
    @Inject(LOCAL_NAMES) private names: LocalNames
  ) {}

  loading = false;

  vtuber: VTuber = vtubers[this.route.snapshot.paramMap.get("id")];

  bilibiliSubs: MultiSeries = [];
  bilibiliViews: MultiSeries = [];
  youtubeSubs: MultiSeries = [];
  youtubeViews: MultiSeries = [];

  ngOnInit() {
    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
    }

    this.title.setTitle(`${this.names[this.vtuber.id]} | HoloStats`);

    this.loading = true;

    const end = endOfToday();

    this.api
      .getChannelReport(
        this.vtuber.id,
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
