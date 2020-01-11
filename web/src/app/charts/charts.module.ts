import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { AreaChartComponent } from "./area-chart.component";

@NgModule({
  declarations: [AreaChartComponent],
  imports: [CommonModule, NgxChartsModule],
  exports: [AreaChartComponent]
})
export class ChartsModule {}
