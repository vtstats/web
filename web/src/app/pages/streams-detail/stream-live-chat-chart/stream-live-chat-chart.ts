import { CommonModule, formatDate, formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  LOCALE_ID,
  OnChanges,
} from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { differenceInMinutes } from "date-fns";
import type { ECharts, EChartsOption } from "echarts";
import { CallbackDataParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { Stream } from "src/app/models";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [Chart, CommonModule, MatCheckboxModule],
  selector: "hls-stream-live-chat-chart",
  templateUrl: "stream-live-chat-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamLiveChatChart implements OnChanges {
  private locale = inject(LOCALE_ID);

  @Input() rows: [number, number, number][];
  @Input() stream: Stream;

  sample: boolean = true;
  option: EChartsOption;
  total: number;
  perMin: number;

  ngOnChanges() {
    let total = [];
    let member = [];

    if (this.sample) {
      total = sampling(
        this.rows,
        { count: 50 },
        (row) => row[0],
        (row) => row[1],
        (a, b) => a + b
      );
      member = sampling(
        this.rows,
        { count: 50 },
        (row) => row[0],
        (row) => row[2],
        (a, b) => a + b
      );
    } else {
      total = this.rows.map((r) => [r[0], r[1]]);
      member = this.rows.map((r) => [r[0], r[2]]);
    }

    this.option = {
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
        formatter: (p: CallbackDataParams[]) => {
          const d = p[0].value[0] as number;
          const v1 = p[0].value[1] as number;
          const v2 = p[1].value[1] as number;

          return `<table class="w-32">\
          <thead><tr><td colspan="2" class="text-xs text-[#737373]">${formatDate(
            d,
            "yyyy/MM/dd HH:mm",
            this.locale
          )}</td></tr>\
          </thead>\
          <tbody class="text-sm">\
          ${
            v1 > 0
              ? `<tr><td class="text-[#737373]">Member</td><td class="text-right">${formatNumber(
                  v1,
                  this.locale
                )}</td></tr>`
              : ""
          }
          <tr><td class="text-[#737373]">Total</td><td class="text-right">${formatNumber(
            v2,
            this.locale
          )}</td></tr>
          </tbody>\
          ${
            this.stream.status === "ended"
              ? `<tfoot><tr class="text-xs text-[#737373]"><td colspan="2">Double click to jump to</td></tr></tfoot>`
              : ""
          }
          </table>`;
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
      series: [
        {
          name: "Member",
          type: "line",
          showSymbol: false,
          sampling: "sum",
          smooth: true,
          z: 50,
          areaStyle: { opacity: 1, color: "#855CF8" },
          color: "#855CF8",
          data: member,
        },
        {
          name: "Total",
          type: "line",
          showSymbol: false,
          sampling: "sum",
          smooth: true,
          areaStyle: { opacity: 1, color: "#B7A8F4" },
          color: "#B7A8F4",
          data: total,
        },
      ],
    };

    this.total = total.reduce((acc, cur) => acc + cur[1], 0);

    this.perMin =
      this.total /
      differenceInMinutes(
        this.stream.endTime || Date.now(),
        this.stream.startTime
      );
  }

  onChartInit(chart: ECharts) {
    chart.getZr().on("dblclick", (params) => {
      const [x] = chart.convertFromPixel("grid", [
        params.offsetX,
        params.offsetY,
      ]);

      if (
        this.stream.status === "ended" &&
        this.stream.startTime <= x &&
        x <= this.stream.endTime
      ) {
        const t = ((x - this.stream.startTime) / 1000) | 0;
        window.open(
          `https://youtu.be/${this.stream.streamId}?t=${t}s`,
          "_blank"
        );
      }
    });
  }
}
