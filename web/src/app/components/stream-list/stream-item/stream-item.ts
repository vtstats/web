import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { switchMap } from "rxjs";

import type { Stream } from "src/app/models";
import {
  ConfigService,
  DistancePipe,
  DurationPipe,
  GoogleApiService,
  NamePipe,
  TickService,
} from "src/app/shared";

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    DistancePipe,
    DurationPipe,
    NamePipe,
    NgOptimizedImage,
  ],
  selector: "hls-stream-item",
  templateUrl: "stream-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamItem {
  tick = inject(TickService);
  private config = inject(ConfigService);
  private gapi = inject(GoogleApiService);
  private snackBar = inject(MatSnackBar);

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
