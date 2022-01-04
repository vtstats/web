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
  selected: YouTubePlayListItem;

  ngOnInit() {
    this.loading = true;
    this.gapi.listPlaylist().subscribe({
      next: (res) => {
        this.items = res.items;
        this.selected = res.items.find(
          (item) => item.id === this.config.playlist
        );
        this.loading = false;
        if (!this.selected && res.items.length > 0) {
          this.select(res.items[0]);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  select(item: YouTubePlayListItem) {
    this.selected = item;
    this.config.setPlaylist(item.id);
  }
}
