import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PortalModule } from "@angular/cdk/portal";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { OverlayModule } from "@angular/cdk/overlay";

import { ApxChart } from "./apx-chart/apx-chart";
import { ChannelStats } from "./channel-stats/channel-stats";
import {
  ChannelStatsChart,
  ChannelStatsChartShimmer,
} from "./channel-stats-chart/channel-stats-chart";
import { BigNumber, BigNumberShimmer } from "./big-number/big-number";
import {
  ChannelTable,
  ChannelTableShimmer,
} from "./channel-table/channel-table";
import { LiveChat } from "./live-chat/live-chat";
import { LoadingSpinner } from "./loading-spinner/loading-spinner";
import { NumberRow } from "./number-row/number-row";
import { StreamItem, StreamItemShimmer } from "./stream-item/stream-item";
import { StreamGroup } from "./stream-group/stream-group";
import { StreamsList } from "./stream-list/stream-list";
import {
  StreamStatsChart,
  StreamStatsChartShimmer,
} from "./stream-stats-chart/stream-stats-chart";
import {
  StreamsSummary,
  StreamsSummaryShimmer,
} from "./stream-summary/stream-summary";
import { SubMenu, SubMenuTitle, SubMenuExtra } from "./sub-menu/sub-menu";
import { DateFilter } from "./date-filter/date-filter";
import { VTuberFilter } from "./vtuber-filter/vtuber-filter";
import { FilterGroup } from "./filter-group/filter-group";
import { StreamTime } from "./stream-time/stream-time";
import { PopperComponent } from "./popper/popper";
import { ChartAxis } from "./chart-axis/chart-axis";
import { PaidLiveChat } from "./paid-chat-chart/paid-chat-chart";

import { SharedModule } from "src/app/shared";

@NgModule({
  declarations: [
    ApxChart,
    ChannelStats,
    ChannelStatsChart,
    ChannelStatsChartShimmer,
    BigNumber,
    BigNumberShimmer,
    ChannelTable,
    ChannelTableShimmer,
    LiveChat,
    PaidLiveChat,
    PopperComponent,
    LoadingSpinner,
    NumberRow,
    StreamGroup,
    StreamItem,
    StreamItemShimmer,
    StreamsList,
    StreamStatsChart,
    StreamStatsChartShimmer,
    StreamsSummary,
    StreamsSummaryShimmer,
    StreamTime,
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    DateFilter,
    VTuberFilter,
    FilterGroup,
    ChartAxis,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortalModule,
    OverlayModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    SharedModule,
  ],
  exports: [
    BigNumber,
    ChannelStats,
    ChannelTable,
    ChannelTableShimmer,
    LoadingSpinner,
    NumberRow,
    LiveChat,
    PaidLiveChat,
    PopperComponent,
    StreamGroup,
    StreamItem,
    StreamItemShimmer,
    StreamsList,
    StreamStatsChart,
    StreamStatsChartShimmer,
    StreamsSummary,
    StreamsSummaryShimmer,
    StreamTime,
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    FilterGroup,
  ],
})
export class ComponentsModule {}
