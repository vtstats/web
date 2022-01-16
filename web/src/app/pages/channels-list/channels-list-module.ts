import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";

import { ComponentsModule } from "src/app/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";

import { BilibiliChannel } from "./bilibili-channel/bilibili-channel";
import { YoutubeChannel } from "./youtube-channel/youtube-channel";
import { ChannelTable } from "./channel-table/channel-table";
import { ChannelTableShimmer } from "./channel-table/channel-table";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    RouterModule.forChild([
      {
        matcher: (url, group) =>
          group.segments[0]?.path === "youtube-channel"
            ? { consumed: url }
            : null,
        component: YoutubeChannel,
      },
      {
        matcher: (url, group) =>
          group.segments[0]?.path === "bilibili-channel"
            ? { consumed: url }
            : null,
        component: BilibiliChannel,
      },
    ]),
  ],
  declarations: [
    BilibiliChannel,
    YoutubeChannel,
    ChannelTable,
    ChannelTableShimmer,
  ],
})
export class ChannelsListModule {}
