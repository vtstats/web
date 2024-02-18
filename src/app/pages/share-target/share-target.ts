import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Platform } from "src/app/models";

import { CATALOG_CHANNELS } from "src/app/shared/tokens";

@Component({ standalone: true, selector: "vts-share-target", template: "" })
export class ShareTarget implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private channels = inject(CATALOG_CHANNELS);

  ngOnInit() {
    const map = this.route.snapshot.queryParamMap;

    const shareParams = [map.get("title"), map.get("text"), map.get("url")]
      .filter(Boolean)
      .join(" ");

    // match youtube video id
    const youtubeVideoId =
      /youtube.com\/watch\?v=([A-Za-z0-9_-]{11})/.exec(shareParams)?.[1] ||
      /youtube.com\/live\/([A-Za-z0-9_-]{11})/.exec(shareParams)?.[1] ||
      /youtu.be\/([A-Za-z0-9_-]{11})/.exec(shareParams)?.[1];

    if (youtubeVideoId) {
      this.router.navigate(["youtube-stream", youtubeVideoId], {
        replaceUrl: true,
      });
      return;
    }

    // match channel id
    const youtubeChannelId = /youtube.com\/channel\/([A-Za-z0-9_-]{24})/.exec(
      shareParams,
    )?.[1];

    if (youtubeChannelId) {
      const channel = this.channels.find(
        (c) =>
          c.platform === Platform.YOUTUBE && c.platformId === youtubeChannelId,
      );

      if (channel) {
        this.router.navigate(["vtuber", channel.vtuberId], {
          replaceUrl: true,
        });
        return;
      }
    }

    // this.snackBar.open("Channel not found", undefined, { duration: 2_000 });

    this.router.navigate([""], { replaceUrl: true });
  }
}
