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

import { ChannelEX } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";
import { translate } from "src/i18n";

type Option = {
  ids?: string[];
};

@Component({
  selector: "hs-youtube-channel-ex",
  templateUrl: "youtube-channel-ex.html",
  styleUrls: ["../youtube-channel/youtube-channel.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YoutubeChannelEX implements OnInit, OnDestroy {
  constructor(
    private api: ApiService,
    private title: Title,
    private config: ConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  loading = false;
  updatedAt: number;
  dataSource: Array<ChannelEX> = [];

  option$ = new Subject<Option>();

  ngOnInit() {
    this.title.setTitle(`${translate("youtubeChannelEX")} | TaiwanVuber`);

    this.option$
      .pipe(
        startWith({ ids: [] }),
        tap(() => {
          this.loading = true;
          this.cdr.markForCheck();
        }),
        switchMap(({ ids }) =>
          this.api.youtubeChannelsEX({
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

  onClear() {
    this.option$.next({ ids: [] });
  }

  onVTuberChange(ids: Set<string>) {
    this.option$.next({ ids: [...ids] });
  }

  ngOnDestroy() {
    this.option$.complete();
  }
}
