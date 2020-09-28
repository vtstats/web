import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { endOfToday, subDays, parseISO } from "date-fns";
import type { MultiSeries, DataItem } from "@swimlane/ngx-charts";

import { vtubers } from "vtubers";

import { VTuber, Stream, StreamListResponse } from "src/app/models";
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

  chartLoading = false;
  streamLoading = false;

  streams: Stream[] = [];
  lastStreamStart: Date;

  showSpinner = false;

  vtuber: VTuber = vtubers[this.route.snapshot.paramMap.get("id")];

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  obs = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.api
        .getYouTubeStreams([this.vtuber.id], { endAt: this.lastStreamStart })
        .subscribe((res) => this.addStreams(res));
    }
  });

  bilibiliSubs: MultiSeries = [];
  bilibiliViews: MultiSeries = [];
  youtubeSubs: MultiSeries = [];
  youtubeViews: MultiSeries = [];

  ngOnInit() {
    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
      return;
    }

    this.title.setTitle(`${this.names[this.vtuber.id]} | HoloStats`);

    this.chartLoading = true;
    this.streamLoading = true;

    const end = endOfToday();

    this.api
      .getChannelReport(
        this.vtuber.id,
        "youtube_channel_subscriber,youtube_channel_view,bilibili_channel_subscriber,bilibili_channel_view",
        subDays(end, 7),
        end
      )
      .subscribe((res) => {
        this.chartLoading = false;

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

    this.api
      .getYouTubeStreams([this.vtuber.id], { endAt: new Date() })
      .subscribe((res) => {
        this.streamLoading = false;
        this.addStreams(res);
      });
  }

  addStreams(res: StreamListResponse) {
    if (res.streams.length == 0) {
      return;
    }

    this.streams.push(...res.streams);

    this.lastStreamStart = parseISO(
      res.streams[res.streams.length - 1].startTime
    );

    if (res.streams.length == 24) {
      this.showSpinner = true;
      this.obs.observe(this.spinnerContainer.nativeElement);
    } else {
      this.showSpinner = false;
    }
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

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
  }
}
