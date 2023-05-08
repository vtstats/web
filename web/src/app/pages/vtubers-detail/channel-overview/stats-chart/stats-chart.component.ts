import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  Output,
} from "@angular/core";
import { type ECharts, type EChartsOption } from "echarts";

import { CommonModule, formatDate, formatNumber } from "@angular/common";
import { Chart } from "src/app/components/chart/chart";
import { ChannelReportKind } from "src/app/models";
import { sampling } from "src/utils";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

@Component({
  standalone: true,
  imports: [Chart, CommonModule],
  selector: "hls-stats-chart",
  template: `<hls-chart
    [loading]="loading"
    [height]="80"
    [options]="options"
    (chartInit)="chartInit.emit($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent {
  @Input() rows: [number, number][] = [];
  @Input() kind: ChannelReportKind;
  @Input() precision: number;
  @Input() loading: boolean;
  @Output() chartInit = new EventEmitter<ECharts>();

  private locale = inject(LOCALE_ID);

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
        trigger: "axis",
        borderRadius: 4,
        backgroundColor: "white",
        borderWidth: 0,
        textStyle: {
          color: "#0F0F0F",
          fontSize: "14px",
          fontWeight: 500,
        },
        padding: [6, 8],
        formatter: (p: TopLevelFormatterParams) => {
          const d = Array.isArray(p) ? p[0] : p;
          const h = d.value[0] as number;
          const t = formatDate(h, "yyyy/MM/dd", this.locale);
          const v = d.value[1] as number;
          const s = formatNumber(v, this.locale);
          return `<div class="text-xs text-[#737373]">${t}<br/></div><div class="text-sm">${s}</div>`;
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
