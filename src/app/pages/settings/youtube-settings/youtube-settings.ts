import { AsyncPipe, NgOptimizedImage } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { GoogleService } from "src/app/shared/config/youtube.service";
import { PlaylistSelector } from "./playlist-selector/playlist-selector";

@Component({
  standalone: true,
  selector: "google-button",
  template: `<div #button></div>`,
})
export class GoogleButton implements AfterViewInit {
  button = inject(ElementRef);

  ngAfterViewInit(): void {
    google.accounts.id.renderButton(this.button.nativeElement, {
      type: "standard",
      theme: "outline",
      size: "large",
    });
  }
}

@Component({
  standalone: true,
  imports: [
    GoogleButton,
    PlaylistSelector,
    MatIconModule,
    AsyncPipe,
    MatButtonModule,
    NgOptimizedImage,
  ],
  selector: "vts-youtube-settings",
  templateUrl: "youtube-settings.html",
})
export class YouTubeSettings {
  google = inject(GoogleService);
}
