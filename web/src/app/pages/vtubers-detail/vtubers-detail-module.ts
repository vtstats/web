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
import { StreamTimeChartTooltip } from "./stream-time/stream-time-chart-tooltip";
import { StreamTimeByDay } from "./stream-time-by-day/stream-time-by-day";
import { StreamTimeByHour } from "./stream-time-by-hour/stream-time-by-hour";
import { StreamTimeByWeekday } from "./stream-time-by-weekday/stream-time-by-weekday";
import { StreamTimeByMonth } from "./stream-time-by-month/stream-time-by-month";
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
    StreamTimeChartTooltip,
    StreamTimeByDay,
    StreamTimeByWeekday,
    StreamTimeByMonth,
    StreamTimeByHour,
    ChannelStatsChart,
    FormatDayDurationPipe,
    VtuberSummary,
    ChartCompare,
  ],
})
export class VTubersDetailModule {}
