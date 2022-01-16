import { Component, OnInit } from "@angular/core";

import { YouTubePlayListItem } from "src/app/models";
import { ConfigService, GoogleApiService } from "src/app/shared";

@Component({
  selector: "hls-playlist-selector",
  templateUrl: "playlist-selector.html",
  styleUrls: ["playlist-selector.scss"],
})
export class PlaylistSelector implements OnInit {
  constructor(private gapi: GoogleApiService, private config: ConfigService) {}

  loading: boolean = false;
  items: YouTubePlayListItem[] = [];
  selected: string;

  ngOnInit() {
    this.loading = true;
    this.gapi.listPlaylist().subscribe({
      next: (res) => {
        this.items = res.items;
        if (this.config.playlist) {
          this.selected = res.items.find(
            (item) => item.id === this.config.playlist
          )?.id;
        }
        if (!this.selected && res.items.length > 0) {
          this.select(res.items[0]);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  select(item: YouTubePlayListItem) {
    this.selected = item.id;
    this.config.setPlaylist(item.id);
  }
}
