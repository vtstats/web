import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { vtubers } from "vtubers";

import { VTuber } from "src/app/models";
import { NamePipe } from "src/app/shared";

import { Helmet } from "src/app/components/helmet/helmet.component";
import { ChannelOverview } from "./channel-overview/channel-overview";
import { StreamTime } from "./stream-time/stream-time";
import { VtuberStreamsComponent } from "./vtuber-streams/vtuber-streams.component";
import { VtuberSummary } from "./vtuber-summary/vtuber-summary";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    Helmet,
    StreamTime,
    VtuberSummary,
    ChannelOverview,
    VtuberStreamsComponent,
    NamePipe,
  ],
  selector: "hls-vtubers-detail",
  templateUrl: "vtubers-detail.html",
})
export class VTubersDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vtuber: VTuber = vtubers[this.route.snapshot.paramMap.get("id")];

  ngOnInit() {
    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
      return;
    }
  }
}
