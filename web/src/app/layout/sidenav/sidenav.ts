import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Output,
  VERSION,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";

import { UpdateIndicator } from "./update-indicator/update-indicator";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UpdateIndicator,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
  ],
  selector: "hls-sidenav",
  templateUrl: "sidenav.html",
  styleUrls: ["sidenav.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Sidenav {
  @Output() buttonClick = new EventEmitter();

  readonly commitId = (window as any).cfPagesCommitSha.slice(0, 7);
  readonly angularVer = VERSION.full;

  readonly menuItems = [
    {
      icon: "youtube",
      title: $localize`:@@youtubeChannel:YouTube Channel`,
      link: "/youtube-channel",
    },
    {
      icon: "bilibili",
      title: $localize`:@@bilibiliChannel:Bilibili Channel`,
      link: "/bilibili-channel",
    },
    {
      icon: "stream",
      title: $localize`:@@youtubeStream:YouTube Stream`,
      link: "/youtube-stream",
    },
    {
      icon: "calendar",
      title: $localize`:@@youtubeSchedule:YouTube Schedule`,
      link: "/youtube-schedule-stream",
    },
    {
      icon: "tune",
      title: $localize`:@@settings:Settings`,
      link: "/settings",
    },
  ];
}
