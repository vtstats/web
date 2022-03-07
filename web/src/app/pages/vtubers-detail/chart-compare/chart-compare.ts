import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "hls-chart-compare",
  templateUrl: "chart-compare.html",
  styleUrls: ["chart-compare.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChartCompare {
  @Input() rows: [number, number][];

  get delta(): number {
    const frist = this.rows[0]?.[1];
    const last = this.rows[this.rows.length - 1]?.[1];

    return last - frist;
  }
}
