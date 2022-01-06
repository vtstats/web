import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { RouterModule } from "@angular/router";

import { ComponentsModule } from "src/app/components/components.module";
import { SharedModule } from "src/app/shared";

import { NumberRow } from "./number-row/number-row";
import { BigNumber, BigNumberShimmer } from "./big-number/big-number";
import { StreamsDetail } from "./streams-detail";
import { LiveChat } from "./live-chat/live-chat";
import { PaidLiveChat } from "./paid-chat-chart/paid-chat-chart";
import {
  StreamStatsChart,
  StreamStatsChartShimmer,
} from "./stream-stats-chart/stream-stats-chart";
import {
  StreamsSummary,
  StreamsSummaryShimmer,
} from "./stream-summary/stream-summary";

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ComponentsModule,
    SharedModule,
    ScrollingModule,
  ],
  declarations: [
    StreamsDetail,
    BigNumber,
    BigNumberShimmer,
    NumberRow,
    LiveChat,
    PaidLiveChat,
    StreamStatsChart,
    StreamStatsChartShimmer,
    StreamsSummary,
    StreamsSummaryShimmer,
  ],
})
export class StreamsDetailModule {}
