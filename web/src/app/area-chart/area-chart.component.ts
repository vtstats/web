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

  youtubeScheme = { domain: ["#e00404"] };
  bilibiliScheme = { domain: ["#00a1d6"] };

  dateTickFormatting(val: number): string {
    return format(fromUnixTime(val), "MM/dd");
  }

  numTickFormatting(num: number): string {
    return num.toLocaleString();
  }
}
