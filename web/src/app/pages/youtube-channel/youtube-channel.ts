import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { startWith, switchMap, tap } from "rxjs/operators";

import { Channel } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";

@Component({
  selector: "hs-youtube-channel",
  templateUrl: "youtube-channel.html",
})
export class YoutubeChannel implements OnInit, OnDestroy {
  constructor(
    private api: ApiService,
    private title: Title,
    private config: ConfigService
  ) {}

  loading = false;
  updatedAt: number;
  dataSource: Array<Channel> = [];

  load$ = new Subject<boolean>();

  ngOnInit() {
    this.title.setTitle(`${$localize`:@@youtubeChannel:`} | HoloStats`);

    this.load$
      .pipe(
        startWith(true),
        tap(() => (this.loading = true)),
        switchMap(() =>
          this.api.youtubeChannels({ ids: [...this.config.vtuber] })
        )
      )
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.dataSource = res.channels;
          this.updatedAt = res.updatedAt;
        },
      });
  }

  ngOnDestroy() {
    this.load$.complete();
  }
}
