import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { range } from "d3-array";
import { scaleLinear } from "d3-scale";
import {
  addWeeks,
  differenceInDays,
  eachDayOfInterval,
  fromUnixTime,
  getDate,
  getDay,
  isSameWeek,
  subWeeks,
} from "date-fns";
import { within } from "src/utils";

import { StreamTimeChart } from "../stream-time/stream-time-chart";

const getFill = (v: number) => {
  if (v <= 0) return "#00bfa510";
  if (v <= 1.5 * 60 * 60) return "#00bfa544";
  if (v <= 3.0 * 60 * 60) return "#00bfa588";
  if (v <= 4.5 * 60 * 60) return "#00bfa5CC";
  return "#00bfa5FF";
};

const relativeInWeek = (date: Date, base: Date): number => {
  let i = 0;

  while (i < 50) {
    if (isSameWeek(addWeeks(base, i), date, { weekStartsOn: 0 })) {
      return i;
    }
    i++;
  }

  return i;
};

@Component({
  selector: "hls-stream-time-by-day",
  templateUrl: "stream-time-by-day.html",
  encapsulation: ViewEncapsulation.None,
})
export class StreamTimeByDay
  extends StreamTimeChart
  implements OnInit, OnChanges, OnDestroy
{
  readonly xScale = scaleLinear().domain([0, 45]).range([20, 920]);
  readonly yScale = scaleLinear().domain([0, 6]).range([0, 120]);

  xTicks: { x: number; d: Date }[] = [];
  yTicks: { y: number; d: Date }[] = [];

  days: { x: number; y: number; d: number; v: number; c: string }[] = [];

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngOnChanges() {
    const end = new Date();
    const start = subWeeks(end, 44);

    this.xTicks = [];
    this.days = [];

    eachDayOfInterval({ start, end }).forEach((d) => {
      const week = relativeInWeek(d, start);
      const day = getDay(d);
      const x = this.xScale(week);
      const y = this.yScale(day);
      this.days.push({ d: d.getTime(), x, y, v: 0, c: getFill(0) });

      if (getDate(d) === 1) {
        this.xTicks.push({ x: x + 8, d });
      }
    });

    this.yTicks = range(0, 7).map((i) => ({
      d: new Date(2017, 0, 1 + i),
      y: this.yScale(i) + 8,
    }));

    for (const time of this.times) {
      const idx = differenceInDays(fromUnixTime(time[0]), start);

      if (within(idx, 0, this.days.length - 1)) {
        this.days[idx].v += time[1];
        this.days[idx].c = getFill(this.days[idx].v);
      }
    }
  }

  getItemByOffset(offsetX: number, offsetY: number) {
    const idx = this.days.findIndex(
      (day) =>
        within(offsetX, day.x, day.x + 20) && within(offsetY, day.y, day.y + 20)
    );

    if (idx >= 0) {
      return {
        idx,
        x: this.days[idx].x,
        y: this.days[idx].y,
        width: 16,
        height: 0,
      };
    }

    return { idx: -1, x: 0, y: 0, width: 0, height: 0 };
  }
}
