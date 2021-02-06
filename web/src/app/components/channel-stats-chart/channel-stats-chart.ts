import {
  Input,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
} from "@angular/core";
import { formatNumber } from "@angular/common";

import { ApxChart } from "../apx-chart/apx-chart";

// these d3 dependencies came from ngx-charts
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChannelReportKind, Report } from "src/app/models";
import { translate } from "src/i18n";

@Component({
  selector: "hs-channel-stats-chart",
  template: `
    <div class="channel-stats-chart">
      <div class="toolbar">
        <span>{{ title }}</span>
        <span class="spacer"></span>
        <button mat-icon-button (click)="changeRange(1)">1d</button>
        <button mat-icon-button (click)="changeRange(3)">3d</button>
        <button mat-icon-button (click)="changeRange(7)">7d</button>
      </div>
      <apx-chart #chart></apx-chart>
    </div>
  `,
  styleUrls: ["channel-stats-chart.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelStatsChart implements OnChanges {
  @Input() report: Report<ChannelReportKind>;

  @ViewChild("chart", { static: true })
  private chart: ApxChart;

  get title(): string {
    return translate(
      {
        [ChannelReportKind.youtubeChannelSubscriber]: "youtubeSubscribers",
        [ChannelReportKind.youtubeChannelView]: "youtubeViews",
        [ChannelReportKind.bilibiliChannelSubscriber]: "bilibiliSubscribers",
        [ChannelReportKind.bilibiliChannelView]: "bilibiliViews",
      }[this.report.kind]
    );
  }

  get colors(): string[] {
    switch (this.report.kind) {
      case ChannelReportKind.youtubeChannelSubscriber:
      case ChannelReportKind.youtubeChannelView:
        return ["#e00404"];
      case ChannelReportKind.bilibiliChannelSubscriber:
      case ChannelReportKind.bilibiliChannelView:
        return ["#00a1d6"];
    }
  }

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

  changeRange(day: number) {
    const end = this.report.rows[this.report.rows.length - 1][0];
    this.chart.zoomX(end - day * 24 * 60 * 60 * 1000, end);
  }

  ngOnChanges() {
    this.chart.createChart({
      series: [{ data: this.report.rows }],
      stroke: {
        width: 4,
      },
      yaxis: {
        labels: {
          formatter: this.numFormatting,
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
          formatter: timeFormat("%m/%d"),
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
