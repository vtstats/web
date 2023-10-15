import { NgIf } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

import { Stream } from "src/app/models";

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
export default class StreamsDetail implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  @Input({ required: true }) stream!: Stream;

  ngOnInit() {
    const title = this.stream.title + " | vtstats";
    const image = `https://vt-og.poi.cat/${this.stream.platform.toLowerCase()}-stream/${
      this.stream.platformId
    }.png`;

    this.title.setTitle(title);
    this.meta.updateTag({ property: "og:title", content: title });
    this.meta.updateTag({ property: "og:image", content: image });
    this.meta.updateTag({ name: "twitter:title", content: title });
    this.meta.updateTag({ name: "twitter:image", content: image });
  }
}
