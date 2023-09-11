import { NgIf } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { Platform, Stream } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { StreamChatStats } from "./stream-chat-stats/stream-chat-stats";
import { StreamEvents } from "./stream-events/stream-events";
import { StreamSummary } from "./stream-summary/stream-summary";
import { StreamViewerStats } from "./stream-viewer-stats/stream-viewer-stats";

@Component({
  standalone: true,
  imports: [
    NgIf,
    StreamChatStats,
    StreamEvents,
    StreamSummary,
    StreamViewerStats,
    UseQryPipe,
  ],
  selector: "hls-streams-detail",
  templateUrl: "streams-detail.html",
})
export default class StreamsDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qry = inject(QryService);
  private title = inject(Title);

  streamQry: Qry<
    Stream,
    unknown,
    Stream,
    Stream,
    ["stream", { platform: Platform; platformId: string }]
  >;

  ngOnInit() {
    const streamId = this.route.snapshot.paramMap.get("streamId");
    const platform = this.route.snapshot.data.platform;

    this.streamQry = this.qry.create<
      Stream,
      unknown,
      Stream,
      Stream,
      ["stream", { platform: Platform; platformId: string }]
    >({
      queryKey: ["stream", { platform, platformId: streamId }],

      queryFn: ({ queryKey: [_, { platform, platformId }] }) =>
        api.streamsByPlatformId(platform, platformId),

      onSuccess: (stream) => {
        if (!stream) {
          this.router.navigateByUrl("/404");
        } else {
          this.title.setTitle(stream.title + " | vtstats");
        }
      },
    });
  }
}
