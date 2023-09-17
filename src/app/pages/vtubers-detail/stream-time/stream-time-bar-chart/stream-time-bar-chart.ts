import { formatDate } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  LOCALE_ID,
  inject,
} from "@angular/core";
import { flatRollup, range, sort } from "d3-array";
import { formatDuration, fromUnixTime } from "date-fns";
import type { EChartsOption } from "echarts";
import type { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { LocaleService } from "src/app/shared/config/locale.service";

@Component({
  selector: "vts-stream-time-bar-chart",
  standalone: true,
  imports: [Chart],
  templateUrl: "./stream-time-bar-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamTimeBarChart {
  @Input() times: [number, number][] | undefined = [];
  @Input() groupBy: "hour" | "weekday" | "month";

  private locale = inject(LOCALE_ID);
  private locale_ = inject(LocaleService);

  get width(): number {
    switch (this.groupBy) {
      case "hour": {
        return 24 * 32 + 8;
      }
      case "month": {
        return 11 * 32 + 8;
      }
      case "weekday": {
        return 7 * 32 + 8;
      }
    }
  }

  get options(): EChartsOption {
    return {
      tooltip: {
        trigger: "axis",
        position: "top",
        borderRadius: 4,
        backgroundColor: "white",
        borderWidth: 0,
        textStyle: {
          color: "#0F0F0F",
          fontSize: "14px",
          fontWeight: 500,
        },
        padding: [6, 8],
        formatter: this._tooltipFormatter(),
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        axisTick: { alignWithLabel: true },
        axisLabel: { formatter: this._labelFormatter() },
      },
      yAxis: {
        type: "value",
        axisLabel: { show: false },
      },
      series: {
        name: "Times",
        type: "bar",
        data: this._groupByData(),
        color: "#855CF8",
        itemStyle: {
          borderRadius: 2,
        },
      },
    };
  }

  private _tooltipFormatter() {
    const _formatDuration = (value: number) => {
      if (value == 0) {
        return $localize`:@@no-stream:No stream`;
      }

      if (value >= 3600) {
        return formatDuration(
          { hours: ((value / 360) | 0) / 10 },
          { locale: this.locale_.dateFns }
        );
      }

      return formatDuration(
        { minutes: (value / 60) | 0 },
        { locale: this.locale_.dateFns }
      );
    };

    switch (this.groupBy) {
      case "hour": {
        return (p: TopLevelFormatterParams) => {
          const d = Array.isArray(p) ? p[0] : p;
          const h = d.value[0] as number;
          const t =
            h.toString().padStart(2, "0") +
            ":00-" +
            (h + 1).toString().padStart(2, "0") +
            ":00";
          const v = d.value[1] as number;
          const s = _formatDuration(v);
          return `<div class="text-xs text-[#737373]">${t}<br/></div><div class="text-sm">${s}</div>`;
        };
      }
      case "month": {
        return (p: TopLevelFormatterParams) => {
          const d = Array.isArray(p) ? p[0] : p;
          const h = d.value[0] as number;
          const t = formatDate(h, "MMMM", this.locale);
          const v = d.value[1] as number;
          const s = _formatDuration(v);
          return `<div class="text-xs text-[#737373]">${t}<br/></div><div class="text-sm">${s}</div>`;
        };
      }
      case "weekday": {
        return (p: TopLevelFormatterParams) => {
          const d = Array.isArray(p) ? p[0] : p;
          const h = d.value[0] as number;
          const t = formatDate(h, "EEEE", this.locale);
          const v = d.value[1] as number;
          const s = _formatDuration(v);
          return `<div class="text-xs text-[#737373]">${t}<br/></div><div class="text-sm">${s}</div>`;
        };
      }
    }
  }

  private _labelFormatter(): any {
    switch (this.groupBy) {
      case "hour": {
        return undefined;
      }
      case "month": {
        return (date: number) => formatDate(date, "MMM", this.locale);
      }
      case "weekday": {
        return (date: number) => formatDate(date, "EEE", this.locale);
      }
    }
  }

  private _groupByData() {
    switch (this.groupBy) {
      case "hour": {
        return this.times.reduce(
          (acc, time) => {
            const idx = fromUnixTime(time[0]).getHours();
            acc[idx][1] += time[1];
            return acc;
          },
          range(0, 24).map((i) => [i, 0] as [number, number])
        );
      }
      case "month": {
        return sort(
          flatRollup(
            this.times,
            (times) => times.reduce((acc, cur) => acc + cur[1], 0),
            ([time, _]) => {
              const dt = fromUnixTime(time);
              return new Date(dt.getFullYear(), dt.getMonth()).getTime();
            }
          ),
          ([m, _]) => m
        );
      }
      case "weekday": {
        return this.times.reduce(
          (acc, time) => {
            const idx = fromUnixTime(time[0]).getDay();
            acc[idx][1] += time[1];
            return acc;
          },
          range(0, 7).map(
            (i) => [new Date(2017, 0, 1 + i).getTime(), 0] as [number, number]
          )
        );
      }
    }
  }
}
