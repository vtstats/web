import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { RouterModule } from "@angular/router";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { SharedModule } from "src/app/shared";
import { ComponentsModule } from "src/app/components/components.module";

import { VTubersDetail } from "./vtubers-detail";
import { StreamTime } from "./stream-time/stream-time";
import { ChannelStatsChart } from "./channel-stats-chart/channel-stats-chart";
import { FormatDayDurationPipe } from "./format-day-duration-pipe/format-day-duration-pipe";
import { VtuberSummary } from "./vtuber-summary/vtuber-summary";
import { ChannelOverview } from "./channel-overview/channel-overview";
import { ChartCompare } from "./chart-compare/chart-compare";

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
    ChannelOverview,
    VTubersDetail,
    ChannelStatsChart,
    StreamTime,
    ChannelStatsChart,
    FormatDayDurationPipe,
    VtuberSummary,
    ChartCompare,
  ],
})
export class VTubersDetailModule {}
