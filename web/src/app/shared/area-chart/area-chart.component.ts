import { Input, Component } from "@angular/core";
import { MultiSeries } from "@swimlane/ngx-charts";

// these d3 dependencies came from ngx-charts
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

const dateFormatters = {
  day: (date: Date) => timeFormat("%m/%d")(date),
  second: (date: Date) => timeFormat("%H:%M")(date),
  dateTime: (date: Date) => timeFormat("%m/%d %H:%M")(date),
};

const scheme = {
  youtube: { domain: ["#e00404"] },
  bilibili: { domain: ["#00a1d6"] },
};

@Component({
  selector: "hs-area-chart",
  templateUrl: "./area-chart.component.html",
})
export class AreaChartComponent {
  @Input() results: MultiSeries = [];
  @Input() autoScale: boolean = true;
  @Input() timeline: boolean = false;

  @Input() timeUnit: keyof typeof dateFormatters = "day";
  @Input() schemeKey: keyof typeof scheme = "youtube";

  get scheme() {
    return scheme[this.schemeKey];
  }

  get dateFormatter() {
    return dateFormatters[this.timeUnit];
  }

  numFormatting = (num: number): string => format("~s")(num);
  timeForamt = dateFormatters["dateTime"];
}
