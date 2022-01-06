import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "src/app/shared";
import { ComponentsModule } from "src/app/components/components.module";

import { VTubersDetail } from "./vtubers-detail";
import { ChannelStats } from "./channel-stats/channel-stats";
import {
  ChannelStatsChart,
  ChannelStatsChartShimmer,
} from "./channel-stats-chart/channel-stats-chart";
import { StreamTime } from "./stream-time/stream-time";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { ScrollingModule } from "@angular/cdk/scrolling";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    MatDividerModule,
    MatIconModule,
    ScrollingModule,
  ],
  declarations: [
    VTubersDetail,
    ChannelStats,
    ChannelStatsChart,
    ChannelStatsChartShimmer,
    StreamTime,
  ],
})
export class VTubersDetailModule {}
