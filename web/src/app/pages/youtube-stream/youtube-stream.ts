import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable, Subject } from "rxjs";
import { startWith, tap, map, scan, switchMap } from "rxjs/operators";

import {
  StreamStatus,
  StreamList,
  StreamListLoadMoreOption,
  StreamGroup,
} from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";

@Component({
  selector: "hs-youtube-stream",
  templateUrl: "youtube-stream.html",
})
export class YoutubeStream implements OnInit, OnDestroy {
  constructor(
    private api: ApiService,
    private title: Title,
    private config: ConfigService
  ) {}

  loadMore$ = new Subject<StreamListLoadMoreOption>();

  data$: Observable<StreamList> = this.loadMore$.pipe(
    startWith<StreamListLoadMoreOption>({ refresh: true }),
    switchMap(({ refresh, last }) =>
      this.api
        .youtubeStreams({
          ids: [...this.config.vtuber],
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
    this.title.setTitle(`${$localize`:@@youtubeStream:`} | HoloStats`);
  }

  ngOnDestroy() {
    this.loadMore$.complete();
  }

  trackBy(_: number, group: StreamGroup): number {
    return group.date;
  }
}
