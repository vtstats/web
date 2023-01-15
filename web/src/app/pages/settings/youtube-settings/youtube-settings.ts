import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

import { GoogleApiService } from "src/app/shared";
import { PlaylistSelector } from "./playlist-selector/playlist-selector";

@Component({
  standalone: true,
  imports: [
    PlaylistSelector,
    MatListModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
  ],
  selector: "hls-youtube-settings",
  templateUrl: "youtube-settings.html",
})
export class YouTubeSettings {
  gapi = inject(GoogleApiService);
}
