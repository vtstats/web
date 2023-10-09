import { NgIf, formatDate, formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
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
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { Stream, StreamStatus } from "src/app/models";

import * as api from "src/app/shared/api/entrypoint";
import { query } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [Chart, NgIf, MatCheckboxModule],
  selector: "vts-stream-viewer-stats",
  templateUrl: "stream-viewer-stats.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamViewerStats {
  private locale = inject(LOCALE_ID);

  stream = signal<Stream | null>(null);
  @Input("stream") set _stream(stream: Stream) {
    this.stream.set(stream);
  }

  statsQry = query<
    Array<[number, number]>,
    unknown,
    Array<[number, number]>,
    Array<[number, number]>,
    ["stream-stats/viewer", { streamId: number }]
  >(() => {
    const st = this.stream();
    return {
      enabled: !!st,
      queryKey: ["stream-stats/viewer", { streamId: st?.streamId }],
      queryFn: () => api.streamViewerStats(st?.streamId),
    };
  });

  options = computed((): EChartsOption => {
    const data = this.statsQry().data;

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
      grid: { left: 16, right: 16, top: 16, bottom: 16, containLabel: true },
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
    } satisfies EChartsOption;
  });

  tooltipFormatter(p: TopLevelFormatterParams) {
    const d = Array.isArray(p) ? p[0] : p;
    const h = d.value[0] as number;
    const v = d.value[1] as number;

    let html = `<div class="text-xs text-[#737373]">\
    ${formatDate(h, "yyyy/MM/dd HH:mm", this.locale)}</div>`;

    html += `<div class="text-sm">${formatNumber(v, this.locale)}</div>`;

    if (this.stream()?.status === StreamStatus.ENDED) {
      html += `<div class="text-xs text-[#737373]">Double click to jump to</div>`;
    }

    return html;
  }

  onChartInit(chart: ECharts) {
    chart.getZr().on("dblclick", (ev) => {
      const [x] = chart.convertFromPixel("grid", [ev.offsetX, ev.offsetY]);
      const st = this.stream();
      if (
        st.status === StreamStatus.ENDED &&
        st.startTime <= x &&
        x <= st.endTime
      ) {
        const t = ((x - st.startTime) / 1000) | 0;
        window.open(`https://youtu.be/${st.platformId}?t=${t}s`, "_blank");
      }
    });
  }
}
