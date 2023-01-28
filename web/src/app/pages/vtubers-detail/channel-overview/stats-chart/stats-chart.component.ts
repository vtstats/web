import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { type ECharts, type EChartsOption } from "echarts";

import { CommonModule } from "@angular/common";
import { Chart } from "src/app/components/chart/chart";
import { ChannelReportKind } from "src/app/models";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [Chart, CommonModule],
  selector: "hls-stats-chart",
  template: `<hls-chart
    [loading]="loading"
    [height]="80"
    [options]="options"
    (chartInit)="chartInit.emit($event)"
  ></hls-chart>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent {
  @Input() rows: [number, number][] = [];
  @Input() kind: ChannelReportKind;
  @Input() precision: number;
  @Input() loading: boolean;
  @Output() chartInit = new EventEmitter<ECharts>();

  get colors() {
    switch (this.kind) {
      case ChannelReportKind.bilibiliChannelSubscriber:
      case ChannelReportKind.bilibiliChannelView:
        return { area: "#64b5f655", line: "#03a9f4" };
      default:
        return { area: "#ff525255", line: "#f44336" };
    }
  }

  get options(): EChartsOption {
    const data = sampling(
      this.rows,
      {
        step: {
          7: 43200 * 1000, // 12 hours
          30: 2 * 86400 * 1000, // 2 days
          90: 6 * 86400 * 1000, // 6 days
        }[this.precision],
      },
      (row) => row[0],
      (row) => row[1],
      Math.max
    );

    const { line, area } = this.colors;

    return <EChartsOption>{
      tooltip: {
        triggerOn: "none",
        position: "top",
        backgroundColor: "rgb(97,97,97)",
        padding: [6, 8],
        borderRadius: 4,
        borderWidth: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        textStyle: {
          color: "#fff",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "Roboto,Helvetica Neue,sans-serif",
        },
      },
      grid: {
        left: 3,
        right: 3,
        top: 0,
        bottom: 0,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        splitLine: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: {
          inside: true,
          alignWithLabel: true,
          show: true,
          interval: 0,
          length: 2434,
        },
        max: "dataMax",
        min: "dataMin",
      },
      yAxis: {
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        max: ({ min, max }) => max + (max - min + 1) * 0.1,
        min: ({ min, max }) => min - (max - min + 1) * 0.1,
      },
      series: {
        data,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        color: line,
        areaStyle: {
          color: area,
        },
      },
    };
  }
}
