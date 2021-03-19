import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PortalModule } from "@angular/cdk/portal";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { OverlayModule } from "@angular/cdk/overlay";
import { EllipsisModule } from "ngx-ellipsis";

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
import { DateSelect } from "./date-select/date-select";

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
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    DateSelect,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortalModule,
    EllipsisModule,
    OverlayModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
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
    StreamGroup,
    StreamItem,
    StreamItemShimmer,
    StreamsList,
    StreamStatsChart,
    StreamStatsChartShimmer,
    StreamsSummary,
    StreamsSummaryShimmer,
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    DateSelect,
  ],
})
export class ComponentsModule {}
