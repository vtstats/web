import { NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { Channel, VTuber } from "src/app/models";
import { VTuberService } from "src/app/shared/config/vtuber.service";
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
export default class VTubersDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private vtuberSrv = inject(VTuberService);

  vtuber: VTuber | null;
  channels: Channel[] = [];

  constructor() {
    const id = this.route.snapshot.paramMap.get("vtuberId");
    this.vtuber = this.vtuberSrv.vtubers().find((v) => v.vtuberId === id);
    this.channels = this.vtuberSrv
      .channels()
      .filter((c) => c.vtuberId === id)
      .sort((a, b) => b.platform.localeCompare(a.platform));

    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
    } else {
      const name = this.vtuberSrv.vtuberNames()[this.vtuber.vtuberId];
      this.title.setTitle(`${name} | vtstats`);
    }
  }
}
