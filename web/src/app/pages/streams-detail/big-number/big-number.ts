import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "hls-big-number",
  template: `
    <div class="value">{{ value }}</div>
    <div class="label">{{ label }}</div>
  `,
  styleUrls: ["big-number.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "big-number" },
})
export class BigNumber {
  @Input() value: string;
  @Input() label: string;
}

@Component({
  selector: "hls-big-number-shimmer",
  template: `
    <div class="value">
      <span class="shimmer text" [style.width.px]="100"></span>
    </div>
    <div class="label">
      <span class="shimmer text" [style.width.px]="70"></span>
    </div>
  `,
  styleUrls: ["big-number.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "big-number" },
})
export class BigNumberShimmer {}
