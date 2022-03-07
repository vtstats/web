import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { flatRollup, max, sort } from "d3-array";
import { scaleLinear } from "d3-scale";
import { fromUnixTime } from "date-fns";

import { StreamTimeChart } from "../stream-time/stream-time-chart";

@Component({
  selector: "hls-stream-time-by-month",
  templateUrl: "stream-time-by-month.html",
  encapsulation: ViewEncapsulation.None,
})
export class StreamTimeByMonth
  extends StreamTimeChart
  implements OnChanges, OnInit, OnDestroy
{
  readonly height = 136;
  readonly innderPadding = 8;
  readonly barWidth = 48;
  readonly leftMargin = this.innderPadding;
  readonly rightMargin = this.innderPadding;
  readonly step = this.barWidth + this.innderPadding;

  yScale = scaleLinear().range([0, 140]);
  months: [number, number][] = [];
  yTicks: number[] = [];

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
    this.months = sort(
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

    this.yScale.domain([0, max(this.months, (row) => row[1])]);

    this.yTicks = this.yScale.ticks(4);
  }

  getItemByOffset(offsetX: number, offsetY: number) {
    const idx = Math.floor((offsetX - this.leftMargin) / 56);

    if (idx >= 0 && idx <= this.months.length) {
      return {
        idx,
        x: this.leftMargin + idx * this.step,
        y: this.height - this.yScale(this.months[idx][1]),
        width: this.barWidth,
        height: 0,
      };
    }

    return { idx: -1, x: 0, y: 0, width: 0, height: 0 };
  }
}
