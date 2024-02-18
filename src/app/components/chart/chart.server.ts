import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "vts-chart",
  standalone: true,
  imports: [],
  template: `
    <div
      class="w-full shimmer rounded animate-pulse"
      [style.height.px]="height"
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
