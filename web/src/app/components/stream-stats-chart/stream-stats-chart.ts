import {
  Input,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
} from "@angular/core";
import { formatNumber } from "@angular/common";
import { format } from "date-fns";

import { ChannelReportKind, Report } from "src/app/models";
import { ApxChart } from "src/app/components/apx-chart/apx-chart";
import { translate, getLocaleId } from "src/i18n";

const custom = ({ series, seriesIndex, dataPointIndex, w }) => {
  return (
    format(w.globals.seriesX[seriesIndex][dataPointIndex], "MM/dd HH:mm") +
    "<br/>" +
    formatNumber(series[seriesIndex][dataPointIndex], getLocaleId())
  );
};

@Component({
  selector: "hs-stream-stats-chart",
  template: `
    <span>{{ title }}</span>
    <apx-chart #chart [height]="350"></apx-chart>
  `,
  styleUrls: ["stream-stats-chart.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "stream-stats-chart" },
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

  ngOnChanges() {
    this.chart.createChart({
      series: [{ data: this.report.rows }],
      stroke: {
        width: 4,
      },
      yaxis: {
        labels: {
          formatter: (val) => formatNumber(val, getLocaleId()),
          minWidth: 40,
        },
      },
      tooltip: {
        custom,
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
        labels: {
          formatter: (date) => format((date as unknown) as number, "HH:mm"),
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
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      colors: this.colors,
    });
  }
}

@Component({
  selector: "hs-stream-stats-chart-shimmer",
  template: `
    <span class="text shimmer" [style.width.px]="90"></span>
    <div class="shimmer" [style.height.px]="350"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamStatsChartShimmer {}
