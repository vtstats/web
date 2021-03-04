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
import { translate } from "src/i18n";

@Component({
  selector: "hs-youtube-channel",
  templateUrl: "youtube-channel.html",
  styleUrls: ["youtube-channel.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YoutubeChannel implements OnInit, OnDestroy {
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
    this.title.setTitle(`${translate("youtubeChannel")} | TaiwanVuber`);

    this.load$
      .pipe(
        startWith(true),
        tap(() => {
          this.loading = true;
          this.cdr.markForCheck();
        }),
        switchMap(() =>
          this.api.youtubeChannels({ ids: [...this.config.vtuber] })
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
