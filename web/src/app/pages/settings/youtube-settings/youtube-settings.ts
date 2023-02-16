import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { GoogleApiService } from "src/app/shared";
import { PlaylistSelector } from "./playlist-selector/playlist-selector";

@Component({
  standalone: true,
  imports: [
    PlaylistSelector,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    NgOptimizedImage,
  ],
  selector: "hls-youtube-settings",
  templateUrl: "youtube-settings.html",
})
export class YouTubeSettings {
  gapi = inject(GoogleApiService);
}
