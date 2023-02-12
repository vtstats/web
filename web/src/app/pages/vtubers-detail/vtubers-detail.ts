import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { VTuber, VTuberService } from "src/app/shared/config/vtuber.service";
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
  private vtuberSrv = inject(VTuberService);

  vtuber: VTuber | null;

  ngOnInit() {
    this.vtuber =
      this.vtuberSrv.vtubers[this.route.snapshot.paramMap.get("id")];
    if (!this.vtuber) {
      this.router.navigateByUrl("/404");
      return;
    } else {
      this.title.setTitle(
        this.vtuberSrv.getName(this.vtuber.id) + " | HoloStats"
      );
    }
  }
}
