import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
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
import { range } from "d3-array";
import { scaleLinear } from "d3-scale";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { Subscription } from "rxjs";

import type { VTuber } from "src/app/models";
import { ApiService } from "src/app/shared";
import { isTouchDevice, within } from "src/utils";

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
  selector: "hls-stream-time",
  templateUrl: "stream-time.html",
  styleUrls: ["stream-time.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamTime implements OnInit {
  @Input() vtuber: VTuber;

  popperIdx = -1;
  offset = isTouchDevice ? 16 : 8;
  referenceRect = null;

  @ViewChild("svg")
  svg: ElementRef<HTMLElement>;
  @ViewChild(CdkScrollable, { static: true }) scrollable: CdkScrollable;

  scroll$: Subscription | null;

  loading: boolean;

  xScale = scaleLinear().domain([0, 45]).range([20, 920]);
  yScale = scaleLinear().domain([0, 6]).range([0, 120]);
  xTicks: { x: number; d: Date }[] = [];
  yTicks: { y: number; d: Date }[] = [];

  days: { x: number; y: number; d: number; v: number; c: string }[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    const end = new Date();
    const start = subWeeks(end, 44);

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

    this.loading = true;

    this.api.streamTimes(this.vtuber.id).subscribe((res) => {
      this.loading = false;

      for (const time of res.times) {
        const idx = differenceInDays(fromUnixTime(time[0]), start);

        if (within(idx, 0, this.days.length - 1)) {
          this.days[idx].v += time[1];
          this.days[idx].c = getFill(this.days[idx].v);
        }
      }

      this.scroll$ = this.scrollable.elementScrolled().subscribe((event) => {
        this.closeTooltip();
      });
    });
  }

  tryOpenTooltip(e: MouseEvent | TouchEvent) {
    if (this.loading) return;

    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;

    const { x, y, left, top } = this.svg.nativeElement.getBoundingClientRect();

    const offsetX = clientX - x;
    const offsetY = clientY - y;

    const idx = this.days.findIndex(
      (day) =>
        within(offsetX, day.x, day.x + 20) && within(offsetY, day.y, day.y + 20)
    );

    if (idx >= 0) {
      if (this.popperIdx === idx) return;

      const x = left + this.days[idx].x;
      const y = top + this.days[idx].y;

      this.referenceRect = {
        width: 16,
        height: 0,
        right: x,
        left: x,
        top: y,
        bottom: y,
      };
      this.popperIdx = idx;
    } else {
      this.closeTooltip();
    }
  }

  closeTooltip() {
    this.popperIdx = -1;
  }
}
