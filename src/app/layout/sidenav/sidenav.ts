import { Component, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";

import { SidenavMenu } from "./menu";
import { UpdateIndicator } from "./update-indicator/update-indicator";

@Component({
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatDividerModule,
    SidenavMenu,
    UpdateIndicator,
  ],
  selector: "hls-sidenav",
  templateUrl: "sidenav.html",
  styleUrls: ["sidenav.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Sidenav {
  readonly channelsItems = [
    {
      icon: "account-multiple-outline",
      title: "Subscribers",
      link: "/channel/subscribers",
    },
    {
      icon: "cash",
      title: "Revenue",
      link: "/channel/revenue",
    },
    {
      icon: "eye",
      title: "Views",
      link: "/channel/views",
    },
  ];

  readonly streamsItems = [
    {
      icon: "stream",
      title: "Live",
      link: "/stream/live",
    },
    {
      icon: "calendar",
      title: "Scheduled",
      link: "/stream/scheduled",
    },
  ];

  readonly extraItems = [
    {
      icon: "cog-outline",
      title: $localize`:@@settings:Settings`,
      link: "/settings",
    },
    {
      icon: "information_outline",
      title: "About",
      link: "/about",
    },
  ];

  commitSha = (<any>window).gitCommitSha;
}
