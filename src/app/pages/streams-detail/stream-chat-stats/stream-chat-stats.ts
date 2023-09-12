import { NgIf, formatDate, formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  inject,
} from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import type { EChartsOption } from "echarts";
import type { ECharts } from "echarts/core";
import type { CallbackDataParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { Stream, StreamStatus } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [Chart, MatCheckboxModule, NgIf],
  selector: "vts-stream-live-chat-chart-inner",
  templateUrl: "stream-chat-stats.html",
})
export class InnerChart implements OnChanges {
  private locale = inject(LOCALE_ID);

  @Input() stream: Stream;
  @Input() rows: Array<[number, number, number]> = [];

  option: EChartsOption;

  ngOnChanges() {
    const total = sampling(
      this.rows,
      { count: 50 },
      (row) => row[0],
      (row) => row[1],
      (a, b) => a + b
    );
    const member = sampling(
      this.rows,
      { count: 50 },
      (row) => row[0],
      (row) => row[2],
      (a, b) => a + b
    );

    this.option = {
      tooltip: {
        trigger: "axis",
        borderRadius: 4,
        backgroundColor: "white",
        borderWidth: 0,
        textStyle: { color: "#0F0F0F", fontSize: "14px", fontWeight: 500 },
        padding: [6, 8],
        formatter: (p) => this.tooltipFormatter(p),
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
        axisLabel: {
          formatter: (value) => formatNumber(value, this.locale),
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
  }

  tooltipFormatter(p: CallbackDataParams[]) {
    const d = p[0].value[0] as number;
    const v1 = p[0].value[1] as number;
    const v2 = p[1].value[1] as number;

    let html = `<table class="w-32"><thead>`;

    html += `<thead><tr><td colspan="2" class="text-xs text-[#737373]">\
    ${formatDate(d, "yyyy/MM/dd HH:mm", this.locale)}</td></tr></thead>`;

    html += `<tbody class="text-sm">`;

    if (v1 > 0) {
      html += `<tr><td class="text-[#737373]">Member</td>\
      <td class="text-right">${formatNumber(v1, this.locale)}</td></tr>`;
    }

    html += `<tr><td class="text-[#737373]">Total</td>\
    <td class="text-right">${formatNumber(v2, this.locale)}</td></tr>`;

    html += `</tbody>`;

    if (this.stream.status === StreamStatus.ENDED) {
      html += `<tfoot><tr class="text-xs text-[#737373]">\
      <td colspan="2">Double click to jump to</td></tr></tfoot>`;
    }

    html += `</table>`;

    return html;
  }

  onChartInit(chart: ECharts) {
    chart.getZr().on("dblclick", (ev) => {
      const [x] = chart.convertFromPixel("grid", [ev.offsetX, ev.offsetY]);

      if (
        this.stream.status === StreamStatus.ENDED &&
        this.stream.startTime <= x &&
        x <= this.stream.endTime
      ) {
        const t = ((x - this.stream.startTime) / 1000) | 0;
        window.open(
          `https://youtu.be/${this.stream.platformId}?t=${t}s`,
          "_blank"
        );
      }
    });
  }
}

@Component({
  standalone: true,
  imports: [Chart, NgIf, MatCheckboxModule, InnerChart, UseQryPipe],
  selector: "vts-stream-chat-stats",
  template: `
    <ng-container *ngIf="statsQry | useQry as result">
      <vts-stream-live-chat-chart-inner
        [stream]="stream"
        [rows]="result.data"
      />
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamChatStats implements OnInit {
  private qry = inject(QryService);

  @Input() stream: Stream;

  statsQry: Qry<
    Array<[number, number, number]>,
    unknown,
    Array<[number, number, number]>,
    Array<[number, number, number]>,
    ["stream-stats/chat", { streamId: number }]
  >;

  ngOnInit() {
    this.statsQry = this.qry.create({
      queryKey: ["stream-stats/chat", { streamId: this.stream.streamId }],
      queryFn: () => api.streamChatStats(this.stream.streamId),
    });
  }
}
