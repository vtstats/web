import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { RouterModule } from "@angular/router";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { SharedModule } from "src/app/shared";
import { ComponentsModule } from "src/app/components/components.module";

import { ApxChart } from "./apx-chart/apx-chart";
import { VTubersDetail } from "./vtubers-detail";
import { ChannelStats } from "./channel-stats/channel-stats";
import {
  ChannelStatsChart,
  ChannelStatsChartShimmer,
} from "./channel-stats-chart/channel-stats-chart";
import { StreamTime } from "./stream-time/stream-time";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    MatDividerModule,
    MatIconModule,
    ScrollingModule,
    RouterModule.forChild([
      {
        path: "",
        component: VTubersDetail,
      },
    ]),
  ],
  declarations: [
    ApxChart,
    VTubersDetail,
    ChannelStats,
    ChannelStatsChart,
    ChannelStatsChartShimmer,
    StreamTime,
  ],
})
export class VTubersDetailModule {}
