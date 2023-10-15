import { formatDate, formatNumber } from "@angular/common";
import { Component, Input, LOCALE_ID, OnInit, inject } from "@angular/core";
import { EChartsOption, RegisteredSeriesOption } from "echarts";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { Stream } from "src/app/models";
import { StreamEventsGroup } from "./stream-events";

@Component({
  standalone: true,
  imports: [Chart],
  selector: "vts-stream-events-chart",
  template: ` <vts-chart [options]="option" [height]="320" /> `,
})
export class StreamEventsChart implements OnInit {
  @Input({ required: true }) group!: StreamEventsGroup;
  @Input({ required: true }) stream!: Stream;

  option: EChartsOption | null = null;
  locale = inject(LOCALE_ID);

  ngOnInit() {
    // @ts-ignore
    const input1: number[] = (this.group.superChats || []).map((c) => c.time);
    // @ts-ignore
    const input2: number[] = (this.group.superSticker || []).map((c) => c.time);
    const input3: number[] = this.group.newMember || [];
    const input4: number[] = this.group.memberMilestone || [];
    const input5: number[] = this.group.twitchCheering || [];
    const input6: number[] = (this.group.twitchHyperChat || []).map(
      // @ts-ignore
      (c) => c.time
    );

    const series: RegisteredSeriesOption["line"][] = [
      {
        name: $localize`:@@super-chats:Super Chats`,
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: $localize`:@@super-sticker:Super Sticker`,
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: $localize`:@@new-member:New Member`,
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: $localize`:@@member-milestone:Member Milestone`,
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: $localize`:@@cheering:Cheering`,
        type: "line",
        data: [],
        sampling: "sum",
      },
      {
        name: $localize`:@@hyper-chat:Hyper Chat`,
        type: "line",
        data: [],
        sampling: "sum",
      },
    ];

    const min = this.stream.startTime;

    if (!min) return;

    const max = this.stream.endTime || Date.now();

    const step = Math.max(((max - min) / 20) | 0, 60 * 1000);

    let i = min;

    while (i + step <= max) {
      const fn1 = (index: number, input: number[]) => {
        const delta = input.filter((v) => v >= i && v < i + step).length;
        const len = series[index].data!.length;
        const last =
          len === 0 ? 0 : (series[index].data![len - 1] as number[])[1];
        series[index].data!.push([i, last + delta]);
      };
      if (input1.length > 0) fn1(0, input1);
      if (input2.length > 0) fn1(1, input2);
      if (input3.length > 0) fn1(2, input3);
      if (input4.length > 0) fn1(3, input4);
      if (input5.length > 0) fn1(4, input5);
      if (input6.length > 0) fn1(5, input6);
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
          formatter: (value: number) => formatDate(value, "HH:mm", this.locale),
        },
      },
      yAxis: {
        type: "value",
        max: ({ max }) => Math.max(max, 3),
        minInterval: 1,
      },
      series: series.filter((a) => a.data!.length != 0),
    };
  }

  tooltipFormatter(p: TopLevelFormatterParams) {
    const params = (Array.isArray(p) ? p : [p]) as Array<{
      seriesName: string;
      value: number[];
    }>;

    const date = formatDate(
      params[0].value[0],
      "yyyy/MM/dd HH:mm",
      this.locale
    );

    let html = `<div class="text-xs text-[#737373]">${date}</div>`;
    for (const param of params.sort((a, b) => b.value[1] - a.value[1])) {
      if (param.value[1] === 0) continue;

      html += `<div class="text-sm">${param.seriesName}: ${formatNumber(
        param.value[1],
        this.locale
      )}</div>`;
    }
    return html;
  }
}
