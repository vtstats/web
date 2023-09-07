import { formatDate, formatNumber } from "@angular/common";
import {
  Component,
  Input,
  LOCALE_ID,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { type EChartsOption } from "echarts";
import type { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";

import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [Chart],
  selector: "hls-channel-stats-inner-chart",
  template: `<hls-chart [height]="80" [options]="options()" />`,
})
export class NameComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  private locale = inject(LOCALE_ID);

  @Input() lineColor: string;
  @Input() areaColor: string;
  @Input() set rows(i: [number, number][]) {
    this.rows_.set(i);
  }
  @Input() set precision(i: number) {
    this.precision_.set(i);
  }

  rows_ = signal<[number, number][]>([]);
  precision_ = signal<number>(7);

  options = computed((): EChartsOption | null => {
    const rows = this.rows_();

    if (!rows) return null;

    const data = sampling(
      rows,
      {
        step: {
          7: 43200 * 1000, // 12 hours
          30: 2 * 86400 * 1000, // 2 days
          90: 6 * 86400 * 1000, // 6 days
        }[this.precision_()],
      },
      (row) => row[0],
      (row) => row[1],
      Math.max
    );

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
        formatter: (p) => this.tooltipFormatter(p),
      },
      grid: { left: 3, right: 3, top: 0, bottom: 0 },
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
        color: this.lineColor,
        areaStyle: {
          color: this.areaColor,
        },
      },
    };
  });

  tooltipFormatter(p: TopLevelFormatterParams) {
    const d = Array.isArray(p) ? p[0] : p;
    const h = d.value[0] as number;
    const t = formatDate(h, "yyyy/MM/dd", this.locale);
    const v = d.value[1] as number;
    const s = formatNumber(v, this.locale);
    return `<div class="text-xs text-[#737373]">${t}<br/></div><div class="text-sm">${s}</div>`;
  }
}
