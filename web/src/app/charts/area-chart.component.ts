import { Input, Component } from "@angular/core";

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
  @Input() dateTickFormatting: (_: number) => string;
  @Input() autoScale: boolean = true;
  @Input() timeline: boolean = false;

  youtubeScheme = { domain: ["#e00404"] };
  bilibiliScheme = { domain: ["#00a1d6"] };

  numTickFormatting(num: number): string {
    return num.toLocaleString();
  }
}
