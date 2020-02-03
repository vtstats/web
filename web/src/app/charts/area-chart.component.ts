import { Input, Component, ViewEncapsulation } from "@angular/core";
import { MultiSeries } from "@swimlane/ngx-charts";

@Component({
  selector: "hs-area-chart",
  templateUrl: "./area-chart.component.html",
  styleUrls: ["./area-chart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AreaChartComponent {
  @Input() xAxisTicks: Date[] = [];
  @Input() results: MultiSeries = [];
  @Input() youtube: boolean = true;
  @Input() label: string | null = null;
  @Input() xScaleMax: Date | null = null;
  @Input() xScaleMin: Date | null = null;
  @Input() dateTickFormatting: (_: number) => string;
  @Input() autoScale: boolean = true;
  @Input() timeline: boolean = false;

  youtubeScheme = { domain: ["#e00404"] };
  bilibiliScheme = { domain: ["#00a1d6"] };

  numTickFormatting(num: number): string {
    return num.toLocaleString();
  }
}
