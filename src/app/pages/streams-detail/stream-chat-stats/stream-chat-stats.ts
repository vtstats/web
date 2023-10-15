import { NgIf, formatDate, formatNumber } from "@angular/common";
import {
  Component,
  Input,
  LOCALE_ID,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import type { EChartsOption } from "echarts";
import type { ECharts } from "echarts/core";
import type { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { Stream, StreamStatus } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { query } from "src/app/shared/qry";
import { sampling } from "src/utils";

@Component({
  standalone: true,
  imports: [Chart, MatCheckboxModule, NgIf],
  selector: "vts-stream-chat-stats",
  templateUrl: "stream-chat-stats.html",
})
export class StreamChatStats {
  private locale = inject(LOCALE_ID);

  stream = signal<Stream | null>(null);
  @Input("stream") set _stream(stream: Stream) {
    this.stream.set(stream);
  }

  statsQry = query<
    Array<[number, number, number]>,
    unknown,
    Array<[number, number, number]>,
    Array<[number, number, number]>,
    ["stream-stats/chat", { streamId: number }]
  >(() => {
    const st = this.stream();
    return {
      enabled: Boolean(st),
      queryKey: ["stream-stats/chat", { streamId: st?.streamId! }],
      queryFn: () => api.streamChatStats(st!.streamId),
    };
  });

  options = computed((): EChartsOption => {
    const rows = this.statsQry().data;

    const total = sampling(
      rows,
      { count: 50 },
      (row) => row[0],
      (row) => row[1],
      (a, b) => a + b
    );
    const member = sampling(
      rows,
      { count: 50 },
      (row) => row[0],
      (row) => row[2],
      (a, b) => a + b
    );

    return {
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
          formatter: (value: number) => formatDate(value, "HH:mm", this.locale),
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => formatNumber(value, this.locale),
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
    } satisfies EChartsOption;
  });

  tooltipFormatter(p: TopLevelFormatterParams) {
    if (!Array.isArray(p)) return "";

    const d = (p[0].value as number[])[0];
    const v1 = (p[0].value as number[])[1];
    const v2 = (p[1].value as number[])[1];

    let html = `<table class="w-32"><thead>`;

    html += `<thead><tr><td colspan="2" class="text-xs text-[#737373]">\
    ${formatDate(d, "yyyy/MM/dd HH:mm", this.locale)}</td></tr></thead>`;

    html += `<tbody class="text-sm">`;

    if (v1 > 0) {
      html += `<tr><td class="text-[#737373]">${$localize`:@@member:Member`}</td>\
      <td class="text-right">${formatNumber(v1, this.locale)}</td></tr>`;
    }

    html += `<tr><td class="text-[#737373]">${$localize`:@@total:Total`}</td>\
    <td class="text-right">${formatNumber(v2, this.locale)}</td></tr>`;

    html += `</tbody>`;

    if (this.stream()?.status === StreamStatus.ENDED) {
      html += `<tfoot><tr class="text-xs text-[#737373]">\
      <td colspan="2">Double click to jump to</td></tr></tfoot>`;
    }

    html += `</table>`;

    return html;
  }

  onChartInit(chart: ECharts) {
    chart.getZr().on("dblclick", (ev) => {
      const [x] = chart.convertFromPixel("grid", [ev.offsetX, ev.offsetY]);
      const st = this.stream();

      if (
        st &&
        st.startTime &&
        st.startTime <= x &&
        st.endTime &&
        st.endTime >= x
      ) {
        const t = ((x - st.startTime) / 1000) | 0;
        window.open(`https://youtu.be/${st.platformId}?t=${t}s`, "_blank");
      }
    });
  }
}
