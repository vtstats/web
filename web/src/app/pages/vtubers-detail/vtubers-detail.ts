import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map, scan, startWith, switchMap, tap } from "rxjs/operators";
import { startOfDay } from "date-fns";
import endOfDay from "date-fns/endOfDay";

import { vtubers } from "vtubers";

import { Stream, StreamList, StreamStatus, VTuber } from "src/app/models";
import { ApiService } from "src/app/shared";

type Option = {
  startAt?: number;
  endAt?: number;
  refresh: boolean;
};

@Component({
  selector: "hls-vtubers-detail",
  templateUrl: "vtubers-detail.html",
  styleUrls: ["vtubers-detail.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VTubersDetail implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  vtuber: VTuber = vtubers[this.route.snapshot.paramMap.get("id")];

  option$ = new Subject<Option>();

  data$: Observable<StreamList> = this.option$.pipe(
    startWith<Option>({ refresh: true }),
    scan<Option, Option>((acc, cur) => ({ ...acc, ...cur })),
    switchMap(({ refresh, startAt, endAt }) =>
      this.api
        .youtubeStreams({
          ids: [this.vtuber.id],
          status: [StreamStatus.live, StreamStatus.ended],
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

  ngOnInit() {
    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
      return;
    }
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

  onClear() {
    this.option$.next({
      endAt: null,
      startAt: null,
      refresh: true,
    });
  }

  ngOnDestroy() {
    this.option$.complete();
  }

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
  }
}
