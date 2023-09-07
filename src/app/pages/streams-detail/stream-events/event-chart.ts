import { formatDate, formatNumber } from "@angular/common";
import { Component, Input, LOCALE_ID, OnChanges, inject } from "@angular/core";
import { EChartsOption, RegisteredSeriesOption } from "echarts";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { StreamEventsGroup } from "./stream-events";

@Component({
  standalone: true,
  imports: [Chart],
  selector: "hls-stream-events-chart",
  template: ` <hls-chart [options]="option" [height]="320" /> `,
})
export class StreamEventsChart implements OnChanges {
  @Input() group: StreamEventsGroup;

  option: EChartsOption;
  locale = inject(LOCALE_ID);

  ngOnChanges() {
    // @ts-ignore
    const input1: number[] = (this.group.superChats || []).map((c) => c.time);
    // @ts-ignore
    const input2: number[] = (this.group.superSticker || []).map((c) => c.time);
    const input3: number[] = this.group.newMember || [];
    const input4: number[] = this.group.memberMilestone || [];

    const min = Math.min(...input1, ...input2, ...input3, ...input4);

    const max = Math.max(...input1, ...input2, ...input3, ...input4);

    const series: RegisteredSeriesOption["line"][] = [
      {
        name: "Super Chats",
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: "Super Sticker",
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: "New Member",
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: "Member Milestone",
        type: "line",
        data: [],
        sampling: "sum",
      },
    ];

    const step = 5 * 60 * 1000; // ((max - min) / 20) | 0;

    let i = min;

    while (i + step <= max) {
      const fn1 = (index: number, input: number[]) => {
        const delta = input.filter((v) => v >= i && v < i + step).length;
        const len = series[index].data.length;
        const last = len === 0 ? 0 : series[index].data[len - 1][1];
        series[index].data.push([i, last + delta]);
      };
      if (input1.length > 0) fn1(0, input1);
      if (input2.length > 0) fn1(1, input2);
      if (input3.length > 0) fn1(2, input3);
      if (input4.length > 0) fn1(3, input4);
      i += step;
    }

    this.option = {
      color: [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#FF5722",
        "#795548",
        "#9E9E9E",
        "#607D8B",
      ],
      tooltip: {
        trigger: "axis",
        borderRadius: 4,
        backgroundColor: "white",
        borderWidth: 0,
        textStyle: { color: "#0F0F0F", fontSize: "14px", fontWeight: 500 },
        padding: [6, 8],
        formatter: (p) => this.tooltipFormatter(p),
      },
      legend: { show: true, right: 16, top: 8 },
      grid: { left: 16, right: 16, top: 36, bottom: 16, containLabel: true },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: (value) => formatDate(value, "HH:mm", this.locale),
        },
      },
      yAxis: {
        type: "value",
      },
      series: series.filter((a) => a.data.length != 0),
    };
  }

  tooltipFormatter(p: TopLevelFormatterParams) {
    const params = Array.isArray(p) ? p : [p];
    const date = formatDate(
      params[0].value[0] as number,
      "yyyy/MM/dd HH:mm",
      this.locale
    );

    let html = `<div class="text-xs text-[#737373]">${date}</div>`;
    for (const param of params.sort((a, b) => b.value[1] - a.value[1])) {
      html += `<div class="text-sm">${param.seriesName}: ${formatNumber(
        param.value[1],
        this.locale
      )}</div>`;
    }
    return html;
  }
}
