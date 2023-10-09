import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  NgIf,
  NgOptimizedImage,
  NgSwitch,
  NgSwitchCase,
} from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SecurityContext,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { switchMap } from "rxjs";

import { Platform, StreamStatus, type Stream } from "src/app/models";
import {
  AvatarPipe,
  ConfigService,
  DistancePipe,
  DurationPipe,
  GoogleApiService,
  NamePipe,
  TickService,
} from "src/app/shared";
import { QUERY_CLIENT } from "src/app/shared/tokens";

@Component({
  standalone: true,
  imports: [
    RouterModule,
    NgSwitch,
    NgIf,
    NgSwitchCase,
    DatePipe,
    DecimalPipe,
    AsyncPipe,
    MatIconModule,
    DistancePipe,
    DurationPipe,
    NamePipe,
    AvatarPipe,
    NgOptimizedImage,
  ],
  selector: "vts-stream-item",
  templateUrl: "stream-item.html",
  styleUrls: ["stream-item.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StreamItem {
  tick = inject(TickService);
  private sanitizer = inject(DomSanitizer);
  private queryClient = inject(QUERY_CLIENT);
  private config = inject(ConfigService);
  private gapi = inject(GoogleApiService);
  private snackBar = inject(MatSnackBar);

  @Input() stream: Stream;

  get titleHtml(): SafeHtml {
    if (this.stream.highlightedTitle) {
      return this.sanitizer.bypassSecurityTrustHtml(
        this.stream.highlightedTitle
      );
    } else {
      return this.sanitizer.sanitize(SecurityContext.HTML, this.stream.title);
    }
  }

  get showPlaylistIcon(): boolean {
    return Boolean(this.config.playlist);
  }

  get routerUrl(): string[] {
    if (this.stream.status === StreamStatus.SCHEDULED) {
      return null;
    }

    switch (this.stream.platform) {
      case Platform.YOUTUBE: {
        return ["/youtube-stream", this.stream.platformId];
      }
      case Platform.TWITCH: {
        return ["/twitch-stream", this.stream.platformId];
      }
      case Platform.BILIBILI: {
        return ["/bilibili-stream", this.stream.platformId];
      }
    }
  }

  onClick() {
    this.queryClient.setQueryData(
      [
        "stream",
        { platform: this.stream.platform, platformId: this.stream.platformId },
      ],
      this.stream
    );
  }

  addToPlaylist(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.gapi
      .addToPlaylist(this.config.playlist, this.stream.platformId)
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
