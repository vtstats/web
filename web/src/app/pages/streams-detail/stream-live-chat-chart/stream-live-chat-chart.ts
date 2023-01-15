import { CommonModule, formatDate, formatNumber } from "@angular/common";
import { Component, inject, Input, LOCALE_ID, OnChanges } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { type EChartsOption } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";

import { Stream } from "src/app/models";
import { ThemeService } from "src/app/shared/config/theme.service";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [NgxEchartsModule, CommonModule, MatCheckboxModule],
  selector: "hls-stream-live-chat-chart",
  templateUrl: "stream-live-chat-chart.html",
})
export class StreamLiveChatChart implements OnChanges {
  private locale = inject(LOCALE_ID);
  theme$ = inject(ThemeService).theme$;

  @Input() rows: [number, number, number][];
  @Input() stream: Stream;

  sample: boolean = true;
  option: EChartsOption;

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
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 32,
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
          areaStyle: {
            opacity: 0.8,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#855CF8FF" },
                { offset: 1, color: "#855CF800" },
              ],
            },
          },
          color: "#855CF8",
          data: member,
        },
        {
          name: "Total",
          type: "line",
          showSymbol: false,
          sampling: "sum",
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
                { offset: 0, color: "#B7A8F4FF" },
                { offset: 1, color: "#B7A8F400" },
              ],
            },
          },
          color: "#B7A8F4",
          data: total,
        },
      ],
    };
  }

  ngOnInit() {}

  jumpTo(e: MouseEvent) {
    // const { x, y } = this.svg.nativeElement.getBoundingClientRect();
    // const offsetX = e.clientX - x;
    // const offsetY = e.clientY - y;
    // const idx = Math.floor(this.xScale.invert(offsetX));
    // if (
    //   !this.loading &&
    //   this.stream.status === "ended" &&
    //   within(idx, 0, this.rows.length - 1) &&
    //   within(offsetY, this.topMargin, this.topMargin + this.height) &&
    //   this.rows[idx][0] > this.stream.startTime
    // ) {
    //   const t = Math.round((this.rows[idx][0] - this.stream.startTime) / 1000);
    //   window.open(`https://youtu.be/${this.stream.streamId}?t=${t}s`, "_blank");
    // }
  }
}
