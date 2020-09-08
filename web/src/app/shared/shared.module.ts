import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { DistancePipe } from "./pipe/distance.pipe";
import { DurationPipe } from "./pipe/duration.pipe";
import { FormatPipe } from "./pipe/format.pipe";
import { NamePipe } from "./pipe/name.pipe";

import { ColoredNumberDirective } from "./directives/colored-number.directive";
import { LazyLoadDirective } from "./directives/lazy-load.directive";

import { ShimmerTableComponent } from "./shimmer/shimmer-table.component";
import { ShimmerStreamListComponent } from "./shimmer/shimmer.stream-list.component";
import { ShimmerSubmenuComponent } from "./shimmer/shimmer-submenu.component";

import { AreaChartComponent } from "./area-chart/area-chart.component";

@NgModule({
  declarations: [
    DistancePipe,
    DurationPipe,
    FormatPipe,
    NamePipe,
    AreaChartComponent,
    ShimmerTableComponent,
    ShimmerStreamListComponent,
    ShimmerSubmenuComponent,
    ColoredNumberDirective,
    LazyLoadDirective,
  ],
  imports: [CommonModule, MatTableModule, NgxChartsModule],
  exports: [
    DistancePipe,
    DurationPipe,
    FormatPipe,
    NamePipe,
    AreaChartComponent,
    ShimmerTableComponent,
    ShimmerStreamListComponent,
    ShimmerSubmenuComponent,
    ColoredNumberDirective,
    LazyLoadDirective,
  ],
})
export class SharedModule {}
