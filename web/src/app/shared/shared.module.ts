import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { EllipsisModule } from "ngx-ellipsis";

import { AreaChartComponent } from "./components/area-chart.component";
import { ShimmerStreamListComponent } from "./components/shimmer.stream-list.component";
import { ShimmerSubmenuComponent } from "./components/shimmer-submenu.component";
import { ShimmerTableComponent } from "./components/shimmer-table.component";
import { StreamItemComponent } from "./components/stream-item.component";

import { ColoredNumberDirective } from "./directives/colored-number.directive";

import { DistancePipe } from "./pipes/distance.pipe";
import { DurationPipe } from "./pipes/duration.pipe";
import { NamePipe } from "./pipes/name.pipe";

import { ApiService } from "./services/api.service";
import { ConfigService } from "./services/config.service";
import { TickService } from "./services/tick.service";

@NgModule({
  declarations: [
    DistancePipe,
    DurationPipe,
    NamePipe,
    AreaChartComponent,
    ShimmerTableComponent,
    ShimmerStreamListComponent,
    ShimmerSubmenuComponent,
    ColoredNumberDirective,
    StreamItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    EllipsisModule,
    MatTableModule,
    MatIconModule,
    NgxChartsModule,
  ],
  exports: [
    DistancePipe,
    DurationPipe,
    NamePipe,
    AreaChartComponent,
    ShimmerTableComponent,
    ShimmerStreamListComponent,
    ShimmerSubmenuComponent,
    ColoredNumberDirective,
    StreamItemComponent,
  ],
  providers: [ApiService, ConfigService, TickService],
})
export class SharedModule {}
