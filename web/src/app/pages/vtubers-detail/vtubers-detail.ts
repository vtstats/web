import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import type { DataItem, MultiSeries } from "@swimlane/ngx-charts";
import { endOfToday, subDays } from "date-fns";
import { Observable, Subject } from "rxjs";
import { map, scan, startWith, switchMap, tap } from "rxjs/operators";

import { vtubers } from "vtubers";

import {
  Channel,
  ChannelReportKind,
  Stream,
  StreamList,
  StreamListLoadMoreOption,
  StreamStatus,
  VTuber,
} from "src/app/models";
import { ApiService } from "src/app/shared";
import { LocalNames, LOCAL_NAMES } from "src/i18n/names";

@Component({
  selector: "hs-vtubers-detail",
  templateUrl: "vtubers-detail.html",
  styleUrls: ["vtubers-detail.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VTubersDetail implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private title: Title,
    @Inject(LOCAL_NAMES) private names: LocalNames
  ) {}

  vtuber: VTuber = vtubers[this.route.snapshot.paramMap.get("id")];

  get hasYouTubeChannel(): boolean {
    return !!this.vtuber.youtube;
  }

  get hasBilibiliChannel(): boolean {
    return !!this.vtuber.bilibili;
  }

  chartLoading = false;

  channels: Channel[];
  bilibiliSubs: MultiSeries = [];
  bilibiliViews: MultiSeries = [];
  youtubeSubs: MultiSeries = [];
  youtubeViews: MultiSeries = [];

  loadMore$ = new Subject<StreamListLoadMoreOption>();

  data$: Observable<StreamList> = this.loadMore$.pipe(
    startWith<StreamListLoadMoreOption>({ refresh: true }),
    switchMap(({ refresh, last }) =>
      this.api
        .youtubeStreams({
          ids: [this.vtuber.id],
          status: [StreamStatus.live, StreamStatus.ended],
          endAt: last?.startTime,
        })
        .pipe(
          map((res) => ({
            streams: res.streams,
            updatedAt: res.updatedAt,
            loading: false,
            reachedEnd: res.streams.length < 24,
            refresh,
          })),
          startWith({ loading: true, refresh })
        )
    ),
    scan<StreamList, StreamList>((acc, cur) => ({
      ...acc,
      ...cur,
      streams: cur.loading
        ? acc.streams
        : cur.refresh
        ? cur.streams
        : [...acc.streams, ...cur.streams],
    })),
    tap(console.log)
  );

  ngOnInit() {
    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
      return;
    }

    this.title.setTitle(`${this.names[this.vtuber.id]} | HoloStats`);

    this.chartLoading = true;
    const end = endOfToday();

    this.api
      .channelReports({
        ids: [this.vtuber.id],
        metrics: [
          ChannelReportKind.youtubeChannelSubscriber,
          ChannelReportKind.youtubeChannelView,
          ChannelReportKind.bilibiliChannelSubscriber,
          ChannelReportKind.bilibiliChannelView,
        ],
        startAt: subDays(end, 7),
        endAt: end,
      })
      .subscribe((res) => {
        this.channels = res.channels;

        this.chartLoading = false;

        for (const report of res.reports) {
          const series = this.generateSeries(report.rows);

          switch (report.kind) {
            case ChannelReportKind.youtubeChannelSubscriber:
              this.youtubeSubs.push({ name: "", series });
              break;
            case ChannelReportKind.youtubeChannelView:
              this.youtubeViews.push({ name: "", series });
              break;
            case ChannelReportKind.bilibiliChannelSubscriber:
              this.bilibiliSubs.push({ name: "", series });
              break;
            case ChannelReportKind.bilibiliChannelView:
              this.bilibiliViews.push({ name: "", series });
              break;
          }
        }
      });
  }

  ngOnDestroy() {
    this.loadMore$.complete();
  }

  generateSeries(rows: Array<[number, number]>): DataItem[] {
    const res = [];
    let prev: number;

    for (const [date, value] of rows) {
      if (prev === undefined || prev !== value) {
        res.push({ name: new Date(date), value });
        prev = value;
      }
    }

    return res;
  }

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
  }
}
