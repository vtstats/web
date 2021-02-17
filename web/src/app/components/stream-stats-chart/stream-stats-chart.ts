import {
  Input,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
} from "@angular/core";

import { ApxChart } from "../apx-chart/apx-chart";
import { formatNumber } from "@angular/common";

// these d3 dependencies came from ngx-charts
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChannelReportKind, Report } from "src/app/models";
import { translate } from "src/i18n";

@Component({
  selector: "hs-stream-stats-chart",
  template: `
    <div class="stream-stats-chart">
      <span>{{ title }}</span>
      <apx-chart #chart></apx-chart>
    </div>
  `,
  styleUrls: ["stream-stats-chart.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamStatsChart implements OnChanges {
  @Input() report: Report<ChannelReportKind>;

  get title(): string {
    return translate("streamViewers");
  }

  get colors(): string[] {
    return ["#e00404"];
  }

  @ViewChild("chart", { static: true })
  private chart: ApxChart;

  custom = ({ series, seriesIndex, dataPointIndex, w }) => {
    return (
      timeFormat("%m/%d %H:%M")(
        w.globals.seriesX[seriesIndex][dataPointIndex]
      ) +
      "<br/>" +
      formatNumber(series[seriesIndex][dataPointIndex], "en")
    );
  };

  numFormatting = (num: number): string => format("~s")(Math.trunc(num));

  ngOnChanges() {
    this.chart.createChart({
      series: [{ data: this.report.rows }],
      stroke: {
        width: 4,
      },
      yaxis: {
        labels: {
          formatter: (val) => formatNumber(val, "en"),
          minWidth: 40,
        },
      },
      tooltip: {
        custom: this.custom,
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
        labels: {
          // @ts-ignore
          formatter: timeFormat("%H:%M"),
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
          position: "back",
          stroke: {
            width: 1,
          },
        },
      },
      markers: {
        size: 0,
      },
      dataLabels: {
        enabled: false,
      },
      chart: {
        id: this.title,
        type: "area",
        height: 350,
        group: "poi",
        toolbar: {
          show: false,
          autoSelected: "pan",
        },
        selection: {
          enabled: false,
        },
      },
      colors: this.colors,
    });
  }
}
