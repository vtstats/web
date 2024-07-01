import {
  AfterRenderPhase,
  Component,
  ElementRef,
  NgZone,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import type { EChartsOption } from "echarts";
import type { ECharts, init } from "echarts/core";

import { ResizeService } from "src/app/shared";
import { ThemeService } from "src/app/shared/config/theme.service";

@Component({
  selector: "vts-chart",
  standalone: true,
  template: `
    <div [style.height.px]="height()" class="w-full relative">
      @if (loading() || !ready()) {
        <div
          dir="ltr"
          class="flex items-center justify-center text-sm mat-secondary-text h-full w-full z-100 absolute"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 h-4 w-4 animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <div>Loading...</div>
        </div>
      }

      <div #container></div>
    </div>
  `,
})
export class Chart {
  loading = input(false);
  options = input.required<EChartsOption | null | undefined>();
  height = input<number>(400);
  chartInit = output<ECharts>();

  container = viewChild.required<ElementRef>("container");

  ngZone = inject(NgZone);
  themeService = inject(ThemeService);
  resizeService = inject(ResizeService);

  ready = signal(false);
  initFn = signal<typeof init | null>(null);

  chart: ECharts | null | undefined;

  constructor() {
    afterNextRender(
      () => {
        import("./echarts").then((mod) => this.initFn.set(mod.default));
      },
      { phase: AfterRenderPhase.Write },
    );
  }

  themeEffect = effect(
    (onCleanup) => {
      const init = this.initFn();

      if (!init) return;

      const theme = this.themeService.theme();
      const el = this.container().nativeElement;
      const height = untracked(() => this.height());
      this.ready.set(false);
      this._dispose();

      this.chart = this.ngZone.runOutsideAngular(() =>
        init(el, theme, { height }),
      );

      this.chartInit.emit(this.chart);
      this.ready.set(true);

      const option = untracked(() => this.options());
      if (option) this.chart.setOption(option);

      onCleanup(() => {
        this._dispose();
      });
    },
    { allowSignalWrites: true },
  );

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
