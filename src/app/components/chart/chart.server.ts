import { Component, input, output } from "@angular/core";
import type { EChartsOption } from "echarts";
import type { ECharts } from "echarts/core";

@Component({
  selector: "vts-chart",
  standalone: true,
  imports: [],
  template: `
    <div
      class="w-full shimmer rounded animate-pulse"
      [style.height.px]="height()"
    ></div>
  `,
  host: { ngSkipHydration: "true" },
})
export class Chart {
  loading = input(false);
  options = input.required<EChartsOption | null | undefined>();
  height = input<number>(400);
  chartInit = output<ECharts>();
}
