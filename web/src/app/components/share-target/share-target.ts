import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { ApiService } from "src/app/shared";

import { vtubers } from "vtubers";

@Component({
  selector: "hls-share-traget",
  templateUrl: "share-traget.html",
})
export class ShareTarget implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    const map = this.route.snapshot.queryParamMap;

    const shareParams = [map.get("title"), map.get("text"), map.get("url")]
      .filter(Boolean)
      .join(" ");

    // match youtube video id
    {
      const match =
        /youtube.com\/watch\?v=([A-Za-z0-9_-]{11})|youtu.be\/([A-Za-z0-9_-]{11})/.exec(
          shareParams
        );

      const id = match?.slice(1).find(Boolean);

      if (id) {
        const res = await lastValueFrom(
          this.api.streamReports({
            ids: [id],
            metrics: [],
          })
        );

        if (res.streams.length) {
          this.router.navigate(["stream", res.streams[0].streamId], {
            replaceUrl: true,
          });
        } else {
          this.snackBar.open("Stream not found", undefined, {
            duration: 2_000,
          });
          this.router.navigate([""], {
            replaceUrl: true,
          });
        }
      }
    }

    // match channel id
    {
      const match = /youtube.com\/channel\/([A-Za-z0-9_-]{24})/.exec(
        shareParams
      );

      const id = match?.[1];

      if (id) {
        const vtuber = Object.values(vtubers).find((v) => v.youtube === id);

        if (vtuber) {
          this.router.navigate(["vtuber", vtuber.id], {
            replaceUrl: true,
          });
        } else {
          this.snackBar.open("Channel not found", undefined, {
            duration: 2_000,
          });
          this.router.navigate([""], {
            replaceUrl: true,
          });
        }
      }
    }
  }
}
