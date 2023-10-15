import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import type { EChartsOption } from "echarts";
import type { ECharts } from "echarts/core";

import { init } from "./echarts";

import { ResizeService } from "src/app/shared";
import { ThemeService } from "src/app/shared/config/theme.service";

@Component({
  selector: "vts-chart",
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      #container
      class="w-full"
      [style.height.px]="height()"
      [ngClass]="loading ? 'shimmer rounded animate-pulse' : null"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { ngSkipHydration: "true" },
})
export class Chart {
  @ViewChild("container", { static: true, read: ElementRef })
  container!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);

  chart: ECharts | null | undefined;

  @Input() loading: boolean = false;

  options = signal<EChartsOption | null | undefined>(null);

  @Input("options") set options_(opts: EChartsOption | null | undefined) {
    this.options.set(opts);
  }

  height = signal(400);

  @Input("height") set height_(h: number) {
    this.height.set(h);
  }

  @Output() chartInit = new EventEmitter<ECharts>();

  themeService = inject(ThemeService);
  resizeService = inject(ResizeService);

  themeEffect = effect((onCleanup) => {
    const theme = this.themeService.theme();

    this._dispose();

    this.chart = this.ngZone.runOutsideAngular(() => {
      return init(this.container.nativeElement, theme, {
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
