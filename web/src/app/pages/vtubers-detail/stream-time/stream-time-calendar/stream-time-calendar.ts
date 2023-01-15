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
import { addDays, differenceInDays, fromUnixTime, subWeeks } from "date-fns";
import { EChartsOption } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";

import { ThemeService } from "src/app/shared/config/theme.service";
import { FormatDurationPipe } from "src/app/shared/pipes/format-duration.pipe";
import { within } from "src/utils";

@Component({
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, FormatDurationPipe],
  selector: "hls-stream-time-calendar",
  templateUrl: "stream-time-calendar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamTimeCalendar implements OnChanges {
  @Input() times: [number, number][] | undefined = [];
  private locale = inject(LOCALE_ID);
  theme$ = inject(ThemeService).theme$;

  option: EChartsOption;

  end = new Date();
  start = subWeeks(this.end, 44);

  get total(): number {
    if (!this.times) return 0;
    return this.times.reduce((acc, cur) => acc + cur[1], 0);
  }

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
