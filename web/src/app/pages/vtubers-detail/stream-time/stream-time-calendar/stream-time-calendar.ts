import { CommonModule, formatDate } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  LOCALE_ID,
  OnChanges,
} from "@angular/core";
import { range } from "d3-array";
import {
  addDays,
  differenceInDays,
  formatDuration,
  fromUnixTime,
  subWeeks,
} from "date-fns";
import { EChartsOption } from "echarts";
import { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { DATE_FNS_LOCALE } from "src/i18n";
import { within } from "src/utils";

@Component({
  standalone: true,
  imports: [CommonModule, Chart],
  selector: "hls-stream-time-calendar",
  templateUrl: "stream-time-calendar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamTimeCalendar implements OnChanges {
  private locale = inject(LOCALE_ID);
  private dateFnsLocale = inject(DATE_FNS_LOCALE);

  @Input() times: [number, number][] | undefined = [];

  option: EChartsOption;
  end = new Date();
  start = subWeeks(this.end, 44);

  ngOnChanges() {
    if (!this.times) return;

    const data: [Date, number][] = range(0, 44 * 7).map((i) => [
      addDays(this.start, i),
      0,
    ]);

    for (const [time, value] of this.times) {
      const idx = differenceInDays(fromUnixTime(time), this.start);

      if (within(idx, 0, data.length - 1)) {
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
              return $localize`No stream`;
            }

            if (value >= 3600) {
              return formatDuration(
                { hours: ((value / 360) | 0) / 10 },
                { locale: this.dateFnsLocale }
              );
            }

            return formatDuration(
              { minutes: (value / 60) | 0 },
              { locale: this.dateFnsLocale }
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
        range: [this.start, this.end],
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
