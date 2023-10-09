import { NgFor, formatDate } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  LOCALE_ID,
  OnChanges,
  inject,
} from "@angular/core";
import { range } from "d3-array";
import {
  addDays,
  formatDuration,
  fromUnixTime,
  isSameDay,
  subDays,
} from "date-fns";
import { EChartsOption } from "echarts";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { DATE_FNS_LOCALE } from "src/app/shared/tokens";

@Component({
  standalone: true,
  imports: [Chart, NgFor],
  selector: "vts-stream-time-calendar",
  templateUrl: "stream-time-calendar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamTimeCalendar implements OnChanges {
  private locale = inject(LOCALE_ID);
  dateFns = inject(DATE_FNS_LOCALE);

  @Input() times: [number, number][] | undefined = [];

  option: EChartsOption;

  ngOnChanges() {
    if (!this.times) return;

    const end = new Date();
    const start = subDays(end, 44 * 7);

    const data: [Date, number][] = range(0, 44 * 7).map((i) => [
      addDays(start, i),
      0,
    ]);

    for (const [time, value] of this.times) {
      const t = fromUnixTime(time);
      const idx = data.findIndex((i) => isSameDay(i[0], t));
      if (idx !== -1) {
        data[idx][1] += value;
      }
    }

    this.option = {
      tooltip: {
        position: "top",
        appendToBody: true,
        borderRadius: 4,
        backgroundColor: "#424242",
        borderWidth: 0,
        textStyle: {
          align: "center",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 500,
        },
        padding: [6, 8],
        formatter: (p: TopLevelFormatterParams) => {
          const _formatDuration = (value: number) => {
            if (value == 0) {
              return $localize`:@@no-stream:No stream`;
            }

            if (value >= 3600) {
              return formatDuration(
                { hours: ((value / 360) | 0) / 10 },
                { locale: this.dateFns }
              );
            }

            return formatDuration(
              { minutes: (value / 60) | 0 },
              { locale: this.dateFns }
            );
          };

          const d = Array.isArray(p) ? p[0] : p;
          const h = d.value[0] as number;
          const t = formatDate(h, "longDate", this.locale);
          const v = d.value[1] as number;
          const s = _formatDuration(v);
          return `<div class="text-xs text-[#ffffffb3]">${t}<br/></div><div class="text-sm">${s}</div>`;
        },
      },
      visualMap: {
        show: false,
        min: 0,
        max: 4.5 * 60 * 60,
        inRange: {
          opacity: [0.1, 1],
          color: "#00bfa5",
        },
      },
      calendar: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 16,
        cellSize: [16, 16],
        range: [start, end],
        itemStyle: {
          borderWidth: 4,
          borderColor: "transparent",
        },
        dayLabel: { show: false },
        monthLabel: {
          position: "end",
          formatter: (param) =>
            formatDate(
              new Date(2017, Number(param.M) - 1, 1),
              "MMM",
              this.locale
            ),
        },
        splitLine: { show: false },
        yearLabel: { show: false },
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",
        data: data,
        itemStyle: {
          borderRadius: 2,
          borderColor: "transparent",
        },
      },
    };
  }
}
