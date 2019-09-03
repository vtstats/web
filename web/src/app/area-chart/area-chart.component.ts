import { Input, Component } from "@angular/core";
import { format, fromUnixTime } from "date-fns";

@Component({
  selector: "hs-area-chart",
  templateUrl: "./area-chart.component.html",
  styleUrls: ["./area-chart.component.scss"]
})
export class AreaChartComponent {
  @Input() xAxisTicks: number[] = [];
  @Input() results: number[][] = [];
  @Input() youtube: boolean = true;
  @Input() label: string | null = null;
  @Input() xScaleMax: number | null = null;
  @Input() xScaleMin: number | null = null;
  @Input() dateTickFormatting: (_: number) => string = this._dateTickFormatting;
  @Input() autoScale: boolean = true;

  youtubeScheme = { domain: ["#e00404"] };
  bilibiliScheme = { domain: ["#00a1d6"] };

  _dateTickFormatting(val: number): string {
    return format(fromUnixTime(val), "MM/dd");
  }

  numTickFormatting(num: number): string {
    return num.toLocaleString();
  }
}
