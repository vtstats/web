import { Component, ViewEncapsulation } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";

import { vtubers, batches } from "vtubers";

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
