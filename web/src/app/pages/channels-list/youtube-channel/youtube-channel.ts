import {
  Component,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
import { startWith, switchMap, tap } from "rxjs/operators";

import { Channel } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";

type Option = {
  ids?: string[];
};

@Component({
  selector: "hls-youtube-channel",
  templateUrl: "youtube-channel.html",
  styleUrls: ["youtube-channel.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class YoutubeChannel implements OnDestroy {
  constructor(
    private api: ApiService,
    private config: ConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  loading = false;
  updatedAt: number;
  dataSource: Array<Channel> = [];

  option$ = new Subject<Option>();

  ngOnInit() {
    this.option$
      .pipe(
        startWith({ ids: [] }),
        tap(() => {
          this.loading = true;
          this.cdr.markForCheck();
        }),
        switchMap(({ ids }) =>
          this.api.youtubeChannels({
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
