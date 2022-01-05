import { Component, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { startWith, tap, map, scan, switchMap } from "rxjs/operators";
import { startOfDay, endOfDay } from "date-fns";

import { StreamStatus, StreamList, StreamGroup, Stream } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";

type Option = {
  ids?: string[];
  startAt?: number;
  endAt?: number;
  refresh: boolean;
};

@Component({
  selector: "hls-youtube-stream",
  templateUrl: "youtube-stream.html",
  styleUrls: ["youtube-stream.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class YoutubeStream implements OnDestroy {
  constructor(private api: ApiService, private config: ConfigService) {}

  option$ = new Subject<Option>();

  data$: Observable<StreamList> = this.option$.pipe(
    startWith({ ids: [], refresh: true }),
    scan<Option, Option>((acc, cur) => ({ ...acc, ...cur })),
    switchMap(({ ids, startAt, endAt, refresh }) =>
      this.api
        .youtubeStreams({
          ids: ids.length === 0 ? [...this.config.vtuber] : ids,
          status: [StreamStatus.live, StreamStatus.ended],
          endAt,
          startAt,
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

  ngOnDestroy() {
    this.option$.complete();
  }

  onRechedEnd(lastStream: Stream) {
    this.option$.next({
      endAt: lastStream.startTime,
      refresh: false,
    });
  }

  onDateRangeChange(range: [Date, Date]) {
    this.option$.next({
      startAt: Number(startOfDay(range[0])),
      endAt: Number(endOfDay(range[1])),
      refresh: true,
    });
  }

  onVTuberChange(ids: Set<string>) {
    this.option$.next({ ids: [...ids], refresh: true });
  }

  onClear() {
    this.option$.next({
      startAt: null,
      endAt: null,
      ids: [],
      refresh: true,
    });
  }

  trackBy(_: number, group: StreamGroup): number {
    return group.date;
  }
}
