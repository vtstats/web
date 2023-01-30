import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { vtubers } from "vtubers";

import { VTuber } from "src/app/models";
import { translate } from "src/i18n";

import { ChannelOverview } from "./channel-overview/channel-overview";
import { StreamTime } from "./stream-time/stream-time";
import { VtuberStreamsComponent } from "./vtuber-streams/vtuber-streams.component";
import { VtuberSummary } from "./vtuber-summary/vtuber-summary";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    StreamTime,
    VtuberSummary,
    ChannelOverview,
    VtuberStreamsComponent,
  ],
  selector: "hls-vtubers-detail",
  templateUrl: "vtubers-detail.html",
})
export class VTubersDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  vtuber: VTuber = vtubers[this.route.snapshot.paramMap.get("id")];

  ngOnInit() {
    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
      return;
    } else {
      this.title.setTitle(translate(this.vtuber.id) + " | HoloStats");
    }
  }
}
