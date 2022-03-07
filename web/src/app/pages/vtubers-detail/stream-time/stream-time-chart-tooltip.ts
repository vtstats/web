import { Component, Input } from "@angular/core";
import { isTouchDevice } from "src/utils";

@Component({
  selector: "hls-stream-time-chart-tooltip",
  template: `
    <div
      class="stream-time-chart-tooltip"
      tooltip
      tooltipPlacement="top"
      [tooltipShift]="true"
      [tooltipFlip]="false"
      [tooltipOffset]="offset"
      [tooltipArrow]="arrow"
      [tooltipReferenceRect]="referenceRect"
      [tooltipContextElement]="contextElement"
    >
      <div class="arrow" #arrow></div>

      <ng-container *ngIf="value; else noStream" i18n="@@streamTimeOn">
        Stream {{ value | formatDuration }} on
        {{ date }}
      </ng-container>

      <ng-template #noStream i18n="@@noStream">
        No stream on {{ date }}
      </ng-template>
    </div>
  `,
})
export class StreamTimeChartTooltip {
  @Input() value: number;
  @Input() date: string;
  @Input() referenceRect: any;
  @Input() contextElement: HTMLElement;

  get offset(): number {
    return isTouchDevice ? 16 : 8;
  }

  constructor() {}
}
