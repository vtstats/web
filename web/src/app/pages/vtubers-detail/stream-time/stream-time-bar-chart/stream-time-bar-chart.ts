import { CommonModule, formatDate } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  LOCALE_ID,
} from "@angular/core";
import { flatRollup, range, sort } from "d3-array";
import { fromUnixTime } from "date-fns";
import type { EChartsOption } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";
import { ThemeService } from "src/app/shared/config/theme.service";

@Component({
  selector: "hls-stream-time-bar-chart",
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: "./stream-time-bar-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamTimeBarChart {
  @Input() times: [number, number][] | undefined = [];
  @Input() groupBy: "hour" | "weekday" | "month";

  theme$ = inject(ThemeService).theme$;
  private locale = inject(LOCALE_ID);

  get options(): EChartsOption {
    let data;
    let formatter;

    switch (this.groupBy) {
      case "hour": {
        data = _groupByHour(this.times);
        break;
      }
      case "month": {
        data = _groupByMonth(this.times);
        formatter = _monthFormatter(this.locale);
        break;
      }
      case "weekday": {
        data = _groupByWeekday(this.times);
        formatter = _weekdayFormatter(this.locale);
        break;
      }
    }

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: { formatter },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: { show: false },
          max: "dataMax",
          axisLine: {},
        },
      ],
      series: [
        {
          name: "Times",
          type: "bar",
          data: data,
          color: "#855CF8",
          itemStyle: {
            borderRadius: 2,
          },
        },
      ],
    };
  }
}

const _weekdayFormatter = (locale: string): ((date: number) => string) => {
  return (date: number) => formatDate(date, "EEE", locale);
};

const _monthFormatter = (locale: string): ((date: number) => string) => {
  return (date: number) => formatDate(date, "MMM", locale);
};

const _groupByHour = (times: [number, number][]): [number, number][] => {
  return times.reduce(
    (acc, time) => {
      const idx = fromUnixTime(time[0]).getHours();
      acc[idx][1] += time[1];
      return acc;
    },
    range(0, 24).map((i) => [i, 0] as [number, number])
  );
};

const _groupByMonth = (times: [number, number][]): [number, number][] => {
  return sort(
    flatRollup(
      times,
      (times) => times.reduce((acc, cur) => acc + cur[1], 0),
      ([time, _]) => {
        const dt = fromUnixTime(time);
        return new Date(dt.getFullYear(), dt.getMonth()).getTime();
      }
    ),
    ([m, _]) => m
  );
};

const _groupByWeekday = (times: [number, number][]): [number, number][] => {
  return times.reduce(
    (acc, time) => {
      const idx = fromUnixTime(time[0]).getDay();
      acc[idx][1] += time[1];
      return acc;
    },
    range(0, 7).map(
      (i) => [new Date(2017, 0, 1 + i).getTime(), 0] as [number, number]
    )
  );
};
