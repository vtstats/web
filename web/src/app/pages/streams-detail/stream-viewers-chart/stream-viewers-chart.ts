import { CommonModule, formatDate, formatNumber } from "@angular/common";
import { Component, inject, Input, LOCALE_ID, OnChanges } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { type EChartsOption } from "echarts";

import { Chart } from "src/app/components/chart/chart";
import { Stream } from "src/app/models";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [Chart, CommonModule, MatCheckboxModule],
  selector: "hls-stream-viewers-chart",
  templateUrl: "stream-viewers-chart.html",
})
export class StreamViewersChart implements OnChanges {
  private locale = inject(LOCALE_ID);

  @Input() stream: Stream;
  @Input() rows: [number, number][] = [];

  sample: boolean = true;
  options: EChartsOption;

  ngOnChanges() {
    let data = [];

    if (this.sample) {
      data = sampling(
        this.rows,
        { count: 50 },
        (row) => row[0],
        (row) => row[1],
        Math.max
      );
    } else {
      data = this.rows;
    }

    this.options = {
      tooltip: {
        trigger: "axis",
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
      series: [
        {
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
      ],
    };
  }
}
