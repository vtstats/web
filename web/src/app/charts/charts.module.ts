import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { SharedModule } from "src/app/shared";

import { AreaChartComponent } from "./area-chart.component";

@NgModule({
  declarations: [AreaChartComponent],
  imports: [CommonModule, NgxChartsModule, SharedModule],
  exports: [AreaChartComponent],
})
export class ChartsModule {}
