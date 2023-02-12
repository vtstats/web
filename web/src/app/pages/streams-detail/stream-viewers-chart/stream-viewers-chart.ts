import { CommonModule, formatDate, formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  LOCALE_ID,
} from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EChartsOption } from "echarts";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { Stream } from "src/app/models";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [Chart, CommonModule, MatCheckboxModule],
  selector: "hls-stream-viewers-chart",
  templateUrl: "stream-viewers-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamViewersChart {
  private locale = inject(LOCALE_ID);

  @Input() stream: Stream;

  @Input() rows: [number, number][];

  get options(): EChartsOption {
    let data = [];

    data = sampling(
      this.rows,
      { count: 50 },
      (row) => row[0],
      (row) => row[1],
      Math.max
    );

    return {
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
          const t = formatDate(h, "yyyy/MM/dd HH:mm", this.locale);
          const v = d.value[1] as number;
          const s = formatNumber(v, this.locale);
          return `<div class="text-xs text-[#737373]">${t}<br/></div><div class="text-sm">${s}</div>`;
        },
      },
      grid: {
        left: 16,
        right: 16,
        top: 16,
        bottom: 16,
        containLabel: true,
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: (value) => formatDate(value, "HH:mm", this.locale),
        },
      },
      yAxis: {
        type: "value",
        position: "right",
        axisLabel: {
          inside: true,
          padding: 8,
          verticalAlign: "top",
          formatter: (value) =>
            value == 0 ? "" : formatNumber(value, this.locale),
        },
      },
      series: {
        name: "Viewers",
        type: "line",
        showSymbol: false,
        sampling: "max",
        smooth: true,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#EA4335FF" },
              { offset: 1, color: "#EA433500" },
            ],
          },
        },
        itemStyle: { color: "#EA4335FF" },
        data: data,
      },
    };
  }
}
