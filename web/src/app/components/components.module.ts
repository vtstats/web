import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PortalModule } from "@angular/cdk/portal";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { EllipsisModule } from "ngx-ellipsis";

import { AreaChart } from "./area-chart/area-chart";
import { BigNumber } from "./big-number/big-number";
import { ChannelTable } from "./channel-table/channel-table";
import { LoadingSpinner } from "./loading-spinner/loading-spinner";
import { NumberRow } from "./number-row/number-row";
import { ShimmerBigNumber } from "./shimmer-big-number/shimmer-big-number";
import { ShimmerStreamItem } from "./shimmer-stream-item/shimmer-stream-item";
import { StreamItem } from "./stream-item/stream-item";
import { StreamGroup } from "./stream-group/stream-group";
import { StreamsList } from "./stream-list/stream-list";
import { StreamsSummary } from "./stream-summary/stream-summary";
import { SubMenu, SubMenuTitle, SubMenuExtra } from "./sub-menu/sub-menu";
import { VTubeSummary } from "./vtuber-summary/vtuber-summary";

import { SharedModule } from "src/app/shared";

@NgModule({
  declarations: [
    AreaChart,
    BigNumber,
    ChannelTable,
    LoadingSpinner,
    NumberRow,
    StreamGroup,
    ShimmerBigNumber,
    ShimmerStreamItem,
    StreamItem,
    StreamsList,
    StreamsSummary,
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    VTubeSummary,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortalModule,
    NgxChartsModule,
    EllipsisModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    SharedModule,
  ],
  exports: [
    AreaChart,
    BigNumber,
    ChannelTable,
    LoadingSpinner,
    NumberRow,
    StreamGroup,
    ShimmerBigNumber,
    ShimmerStreamItem,
    StreamItem,
    StreamsList,
    StreamsSummary,
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    VTubeSummary,
  ],
})
export class ComponentsModule {}
