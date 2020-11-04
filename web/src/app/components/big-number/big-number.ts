import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "hs-big-number",
  templateUrl: "big-number.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "big-number" },
})
export class BigNumber {
  @Input() value: string;
  @Input() label: string;
}
