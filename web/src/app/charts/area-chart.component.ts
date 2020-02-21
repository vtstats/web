import { Input, Component, ViewEncapsulation } from "@angular/core";
import { MultiSeries } from "@swimlane/ngx-charts";

@Component({
  selector: "hs-area-chart",
  templateUrl: "./area-chart.component.html",
  styleUrls: ["./area-chart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AreaChartComponent {
  @Input() results: MultiSeries = [];
  @Input() youtube: boolean = true;
  @Input() label: string | null = null;
  @Input() dateFormatting: (_: number) => string;
  @Input() autoScale: boolean = true;
  @Input() timeline: boolean = false;

  youtubeScheme = { domain: ["#e00404"] };
  bilibiliScheme = { domain: ["#00a1d6"] };

  numFormatting(num: number): string {
    return num.toLocaleString();
  }
}
