import { Component, EventEmitter, Output, input } from "@angular/core";
import type { EChartsOption } from "echarts";
import type { ECharts } from "echarts/core";

import { EChartsComponent } from "./echarts";

@Component({
  selector: "vts-chart",
  standalone: true,
  imports: [EChartsComponent],
  template: `
    @if (loading()) {
      <div
        dir="ltr"
        [style.height.px]="height()"
        class="flex items-center justify-center text-sm mat-secondary-text"
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
    } @else {
      @defer {
        <vts-echarts
          [height]="height()"
          [options]="options()"
          (chartInit)="chartInit.emit($event)"
        />
      } @loading {
        <div
          dir="ltr"
          [style.height.px]="height()"
          class="flex items-center justify-center text-sm mat-secondary-text"
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
    }
  `,
  host: { ngSkipHydration: "true" },
})
export class Chart {
  loading = input(false);
  options = input.required<EChartsOption | null | undefined>();
  height = input<number>(400);

  @Output() chartInit = new EventEmitter<ECharts>();
}
