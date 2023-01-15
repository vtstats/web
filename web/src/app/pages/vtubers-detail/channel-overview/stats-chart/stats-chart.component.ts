import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { type ECharts, type EChartsOption } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";

import { CommonModule } from "@angular/common";
import { ChannelReportKind } from "src/app/models";
import { ThemeService } from "src/app/shared/config/theme.service";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  selector: "hls-stats-chart",
  template: `<div
    echarts
    class="h-20"
    [loading]="loading"
    [options]="options"
    [autoResize]="true"
    [theme]="theme$ | async"
    (chartInit)="onChartInit($event)"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent {
  theme$ = inject(ThemeService).theme$;

  @Input() rows: [number, number][] = [];
  @Input() kind: ChannelReportKind;
  @Input() precision: number;
  @Input() loading: boolean;
  @Output() chartInit = new EventEmitter<ECharts>();

  onChartInit(ec: ECharts) {
    if (this.loading) ec.showLoading();
    this.chartInit.emit(ec);
  }

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
        left: 16,
        right: 16,
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
