import { Component, inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";

import { vtubers } from "vtubers";

@Component({ standalone: true, selector: "hls-share-target", template: "" })
export class ShareTarget implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
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
        this.router.navigate(["stream", id], {
          replaceUrl: true,
        });

        // this.snackBar.open("Stream not found", undefined, {
        //   duration: 2_000,
        // });
        // this.router.navigate([""], {
        //   replaceUrl: true,
        // });
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
