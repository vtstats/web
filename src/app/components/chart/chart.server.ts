import { NgClass } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "vts-chart",
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      #container
      class="w-full"
      [style.height.px]="height"
      [ngClass]="loading ? 'shimmer rounded animate-pulse' : null"
    ></div>
  `,
  host: { ngSkipHydration: "true" },
})
export class Chart {
  @Input() height?: number;
  @Input() options: any;
  @Output() chartInit = new EventEmitter();
  @Input() loading?: boolean;
}
