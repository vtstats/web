import { NgIf } from "@angular/common";
import { Component, Signal, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { Platform, Stream } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";

import { QueryObserverResult } from "@tanstack/query-core";
import { query } from "src/app/shared/qry";
import { QUERY_CLIENT } from "src/app/shared/tokens";
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
  ],
  selector: "vts-streams-detail",
  templateUrl: "streams-detail.html",
})
export default class StreamsDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);

  queryClient = inject(QUERY_CLIENT);

  streamQry: Signal<QueryObserverResult<Stream, unknown>>;

  constructor() {
    const streamId = this.route.snapshot.paramMap.get("streamId");
    const platform = this.route.snapshot.data.platform;

    if (!platform) {
      api.streamsById(Number(streamId)).then((stream) => {
        if (!stream) {
          this.router.navigateByUrl("/404");
        } else {
          this.queryClient.setQueryData(
            [
              "stream",
              { platform: stream.platform, platformId: stream.platformId },
            ],
            stream
          );
          this.router.navigate(
            [`${stream.platform.toLowerCase()}-stream`, stream.platformId],
            { replaceUrl: true }
          );
        }
      });
      return;
    }

    this.streamQry = query<
      Stream,
      unknown,
      Stream,
      Stream,
      ["stream", { platform: Platform; platformId: string }]
    >({
      queryKey: ["stream", { platform, platformId: streamId }],
      queryFn: ({ queryKey: [_, { platform, platformId }] }) =>
        api.streamsByPlatformId(platform, platformId),
      staleTime: 5 * 60 * 1000, // 5min
      onSuccess: (stream) => {
        if (!stream) {
          this.router.navigateByUrl("/404");
          return;
        }

        const title = stream.title + " | vtstats";
        const image = `https://vt-og-image.poi.cat/${stream.platform.toLowerCase()}-stream/${
          stream.platformId
        }.png`;

        this.title.setTitle(title);
        this.meta.updateTag({ property: "og:title", content: title });
        this.meta.updateTag({ property: "og:image", content: image });
        this.meta.updateTag({ name: "twitter:title", content: title });
        this.meta.updateTag({ name: "twitter:image", content: image });
      },
    });

    console.log({ streamQry: this.streamQry() });
  }
}
