import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { startWith, switchMap, tap } from "rxjs/operators";

import { Channel } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";

type Option = {
  ids: string[];
};

@Component({
  selector: "hls-bilibili-channel",
  templateUrl: "bilibili-channel.html",
  styleUrls: ["bilibili-channel.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BilibiliChannel implements OnInit, OnDestroy {
  constructor(
    private api: ApiService,
    private title: Title,
    private config: ConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  loading = false;
  updatedAt: number;
  dataSource: Array<Channel> = [];

  option$ = new Subject<Option>();

  ngOnInit() {
    this.title.setTitle(`${$localize`:@@bilibiliChannel:`} | HoloStats`);

    this.option$
      .pipe(
        startWith({ ids: [] }),
        tap(() => {
          this.loading = true;
          this.cdr.markForCheck();
        }),
        switchMap(({ ids }) =>
          this.api.bilibiliChannels({
            ids: ids.length === 0 ? [...this.config.vtuber] : ids,
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.dataSource = res.channels;
          this.updatedAt = res.updatedAt;
          this.cdr.markForCheck();
        },
      });
  }

  onVTuberChange(ids: Set<string>) {
    this.option$.next({ ids: [...ids] });
  }

  onClear() {
    this.option$.next({ ids: [] });
  }

  ngOnDestroy() {
    this.option$.complete();
  }
}
