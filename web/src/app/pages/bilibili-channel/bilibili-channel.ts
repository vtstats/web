import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { startWith, switchMap, tap } from "rxjs/operators";

import { Channel } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";
import { translate } from "src/i18n";

@Component({
  selector: "hs-bilibili-channel",
  templateUrl: "bilibili-channel.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  load$ = new Subject<boolean>();

  ngOnInit() {
    this.title.setTitle(`${translate("bilibiliChannel")} | HoloStats`);

    this.load$
      .pipe(
        startWith(true),
        tap(() => {
          this.loading = true;
          this.cdr.markForCheck();
        }),
        switchMap(() =>
          this.api.bilibiliChannels({ ids: [...this.config.vtuber] })
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

  ngOnDestroy() {
    this.load$.complete();
  }
}
