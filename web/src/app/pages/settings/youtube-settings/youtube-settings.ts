import { Component, ViewEncapsulation } from "@angular/core";

import { GoogleApiService } from "src/app/shared";

@Component({
  selector: "hls-youtube-settings",
  templateUrl: "youtube-settings.html",
  styleUrls: ["youtube-settings.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class YouTubeSettings {
  constructor(public gapi: GoogleApiService) {}
}
