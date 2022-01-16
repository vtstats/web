import { Component, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, scan, startWith, switchMap, tap } from "rxjs/operators";

import {
  StreamList,
  StreamListOrderBy,
  StreamStatus,
  StreamGroup,
  Stream,
} from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";

type Option = {
  ids?: string[];
  startAt?: number;
  endAt?: number;
  refresh: boolean;
};

@Component({
  selector: "hls-youtube-schedule-stream",
  templateUrl: "youtube-schedule-stream.html",
  styleUrls: ["youtube-schedule-stream.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class YoutubeScheduleStream implements OnDestroy {
  constructor(private api: ApiService, private config: ConfigService) {}

  option$ = new Subject<Option>();

  data$: Observable<StreamList> = this.option$.pipe(
    startWith<Option>({ ids: [], refresh: true }),
    scan<Option, Option>((acc, cur) => ({ ...acc, ...cur })),
    switchMap(({ ids, refresh, startAt, endAt }) =>
      this.api
        .youtubeStreams({
          ids: ids.length === 0 ? [...this.config.vtuber] : ids,
          status: [StreamStatus.scheduled],
          orderBy: StreamListOrderBy.scheduleTimeAsc,
          startAt,
          endAt,
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

  onVTuberChange(ids: Set<string>) {
    this.option$.next({ ids: [...ids], refresh: true });
  }

  onRechedEnd(lastStream: Stream) {
    this.option$.next({
      startAt: lastStream.scheduleTime,
      refresh: false,
    });
  }

  onClear() {
    this.option$.next({ ids: [], refresh: true });
  }

  ngOnDestroy() {
    this.option$.complete();
  }

  trackBy(_: number, group: StreamGroup): number {
    return group.date;
  }
}
