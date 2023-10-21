import { NgIf } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { startOfHour } from "date-fns";

import { Channel, VTuber } from "src/app/models";
import { ChannelOverview } from "./channel-overview/channel-overview";
import { StreamTime } from "./stream-time/stream-time";
import { VtuberStreams } from "./vtuber-streams/vtuber-streams";
import { VtuberSummary } from "./vtuber-summary/vtuber-summary";

@Component({
  standalone: true,
  imports: [NgIf, StreamTime, VtuberSummary, ChannelOverview, VtuberStreams],
  selector: "vts-vtubers-detail",
  templateUrl: "vtubers-detail.html",
})
export default class VTubersDetail implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  @Input({ required: true }) resolved!: {
    name: string;
    vtuber: VTuber;
    channels: Channel[];
  };

  ngOnInit() {
    const title = `${this.resolved.name} | vtstats`;
    // force social media like discord to re-fetch og image
    const image = `https://vt-og.poi.cat/vtuber/${
      this.resolved.vtuber.vtuberId
    }.png?t=${startOfHour(new Date()).getTime()}`;

    this.title.setTitle(title);
    this.meta.updateTag({ property: "og:title", content: title });
    this.meta.updateTag({ property: "og:image", content: image });
    this.meta.updateTag({ name: "twitter:title", content: title });
    this.meta.updateTag({ name: "twitter:image", content: image });
  }
}
