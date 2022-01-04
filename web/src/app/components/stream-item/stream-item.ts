import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { switchMap } from "rxjs";

import type { Stream } from "src/app/models";
import { ConfigService, GoogleApiService, TickService } from "src/app/shared";

@Component({
  selector: "hls-stream-item",
  templateUrl: "stream-item.html",
  styleUrls: ["stream-item.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "stream-item" },
})
export class StreamItem {
  constructor(
    private tick: TickService,
    private config: ConfigService,
    private gapi: GoogleApiService,
    private snackBar: MatSnackBar
  ) {}

  everySecond$ = this.tick.everySecond$;
  everyMinute$ = this.tick.everyMinute$;

  @Input() stream: Stream;

  get showPlaylistIcon(): boolean {
    return Boolean(this.config.playlist);
  }

  addToPlaylist(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.gapi
      .addToPlaylist(this.config.playlist, this.stream.streamId)
      .pipe(
        switchMap(() =>
          this.snackBar
            .open("Video added to playlist.", "VIEW", {
              duration: 5000, // 5s
            })
            .onAction()
        )
      )
      .subscribe({
        next: () => {
          window.open(
            `https://www.youtube.com/playlist?list=${this.config.playlist}`,
            "_blank"
          );
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(
            `Failed to add to playlist: ${err?.error?.error?.message}`,
            undefined,
            {
              duration: 3000, // 3s
            }
          );
        },
      });
  }
}

@Component({
  selector: "hls-stream-item-shimmer",
  templateUrl: "stream-item-shimmer.html",
  styleUrls: ["stream-item.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "stream-item" },
})
export class StreamItemShimmer {}
