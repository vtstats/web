import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable, Subject } from "rxjs";
import { startWith, tap, map, scan, switchMap } from "rxjs/operators";
import { startOfDay, endOfDay } from "date-fns";

import { StreamStatus, StreamList, StreamGroup, Stream } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";
import { translate } from "src/i18n";
import { DateSelect } from "src/app/components/date-select/date-select";

type Option = {
  startAt?: number;
  endAt?: number;
  refresh: boolean;
};

@Component({
  selector: "hs-youtube-stream",
  templateUrl: "youtube-stream.html",
  styleUrls: ["youtube-stream.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class YoutubeStream implements OnInit, OnDestroy {
  constructor(
    private api: ApiService,
    private title: Title,
    private config: ConfigService
  ) {}

  @ViewChild(DateSelect, { static: false }) dateSelect: DateSelect;

  displayClear: boolean = false;

  option$ = new Subject<Option>();

  data$: Observable<StreamList> = this.option$.pipe(
    startWith({ refresh: true }),
    scan<Option, Option>((acc, cur) => ({ ...acc, ...cur })),
    switchMap(({ startAt, endAt, refresh }) =>
      this.api
        .youtubeStreams({
          ids: [...this.config.vtuber],
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

  ngOnInit() {
    this.title.setTitle(`${translate("youtubeStream")} | HoloStats`);
  }

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
    this.displayClear = true;
    this.option$.next({
      startAt: Number(startOfDay(range[0])),
      endAt: Number(endOfDay(range[1])),
      refresh: true,
    });
  }

  clear() {
    this.dateSelect.clear();
    this.displayClear = false;
    this.option$.next({
      startAt: null,
      endAt: null,
      refresh: true,
    });
  }

  trackBy(_: number, group: StreamGroup): number {
    return group.date;
  }
}
