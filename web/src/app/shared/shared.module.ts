import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { AreaChartComponent } from "./components/area-chart.component";
import { ShimmerStreamListComponent } from "./components/shimmer.stream-list.component";
import { ShimmerSubmenuComponent } from "./components/shimmer-submenu.component";
import { ShimmerTableComponent } from "./components/shimmer-table.component";

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
  ],
  imports: [CommonModule, MatTableModule, NgxChartsModule],
  exports: [
    DistancePipe,
    DurationPipe,
    NamePipe,
    AreaChartComponent,
    ShimmerTableComponent,
    ShimmerStreamListComponent,
    ShimmerSubmenuComponent,
    ColoredNumberDirective,
  ],
  providers: [ApiService, ConfigService, TickService],
})
export class SharedModule {}
