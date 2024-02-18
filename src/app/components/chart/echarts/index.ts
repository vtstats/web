import {
  BarChart,
  HeatmapChart,
  LineChart,
  PieChart,
  ScatterChart,
} from "echarts/charts";
import {
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  DatasetComponent,
  LegendComponent,
} from "echarts/components";
import { init, registerTheme, use, ECharts } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
  effect,
  inject,
  input,
  untracked,
  viewChild,
} from "@angular/core";
import type { EChartsOption } from "echarts";

import darkTheme from "./dark-theme";
import lightTheme from "./light-theme";
import { ThemeService } from "src/app/shared/config/theme.service";
import { ResizeService } from "src/app/shared";

use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
  SVGRenderer,
  BarChart,
  HeatmapChart,
  LineChart,
  PieChart,
  DatasetComponent,
  LegendComponent,
  ScatterChart,
]);

registerTheme("dark", darkTheme);
registerTheme("light", lightTheme);

@Component({
  standalone: true,
  selector: "vts-echarts",
  template: `<div
    #container
    class="w-full"
    [style.height.px]="height()"
  ></div>`,
})
export class EChartsComponent {
  chart: ECharts | null | undefined;

  ngZone = inject(NgZone);
  themeService = inject(ThemeService);
  resizeService = inject(ResizeService);

  height = input.required<number>();
  options = input.required<EChartsOption | null | undefined>();
  @Output() chartInit = new EventEmitter<ECharts>();

  container = viewChild.required<ElementRef>("container");

  themeEffect = effect((onCleanup) => {
    const theme = this.themeService.theme();

    this._dispose();

    this.chart = this.ngZone.runOutsideAngular(() => {
      return init(this.container().nativeElement, theme, {
        height: untracked(() => this.height()),
      });
    });

    this.chartInit.emit(this.chart);

    const option = untracked(() => this.options());
    if (option) this.chart.setOption(option);

    onCleanup(() => {
      this._dispose();
    });
  });

  optionEffect = effect(() => {
    const option = this.options();
    if (this.chart && option) {
      this.chart.setOption(option);
    }
  });

  resizeEffect = effect(() => {
    this.resizeService.windowWidth();
    if (this.chart) {
      this.chart.resize({ height: this.height() });
    }
  });

  _dispose() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}

export { init };
