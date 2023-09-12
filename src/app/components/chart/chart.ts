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

// [ngClass]="(loading$ | async) ? 'shimmer rounded animate-pulse' : null"

@Component({
  selector: "vts-chart",
  standalone: true,
  template: `
    <div #container class="w-full" [style.height.px]="_height()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chart {
  @ViewChild("container", { static: true, read: ElementRef })
  container!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);

  chart: ECharts | null = null;

  _options = signal<EChartsOption | null>(null);

  @Input() set options(opts: EChartsOption) {
    this._options.set(opts);
  }

  _height = signal(400);

  @Input() set height(h: number) {
    this._height.set(h);
  }

  @Output() chartInit = new EventEmitter<ECharts>();

  themeService = inject(ThemeService);
  resizeService = inject(ResizeService);

  themeEffect = effect((onCleanup) => {
    const theme = this.themeService.theme();

    this._dispose();

    this.chart = this.ngZone.runOutsideAngular(() => {
      return init(this.container.nativeElement, theme, {
        height: untracked(() => this._height()),
      });
    });

    this.chartInit.emit(this.chart);

    const option = untracked(() => this._options());
    if (option) this.chart.setOption(option);

    onCleanup(() => {
      this._dispose();
    });
  });

  optionEffect = effect(() => {
    const option = this._options();
    if (this.chart && option) {
      this.chart.setOption(option);
    }
  });

  resizeEffect = effect(() => {
    this.resizeService.windowWidth();
    if (this.chart) {
      this.chart.resize({ height: this._height() });
    }
  });

  _dispose() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}
