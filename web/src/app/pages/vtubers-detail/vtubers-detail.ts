import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map, scan, startWith, switchMap, tap } from "rxjs/operators";

import { vtubers } from "vtubers";

import {
  Stream,
  StreamList,
  StreamListLoadMoreOption,
  StreamStatus,
  VTuber,
} from "src/app/models";
import { ApiService } from "src/app/shared";
import { translate } from "src/i18n";

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
    private title: Title
  ) {}

  vtuber: VTuber = vtubers[this.route.snapshot.paramMap.get("id")];

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

    this.title.setTitle(`${translate(this.vtuber.id)} | TaiwanVuber`);
  }

  ngOnDestroy() {
    this.loadMore$.complete();
  }

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
  }
}
