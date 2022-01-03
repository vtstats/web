import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { animationFrameScheduler, fromEvent, Subscription } from "rxjs";
import {
  debounceTime,
  filter,
  map,
  distinctUntilChanged,
} from "rxjs/operators";
import { ScaleLinear, scaleLinear } from "d3-scale";
import { bisectCenter, extent, max, range } from "d3-array";
import { area, curveLinear, line } from "d3-shape";
import { easeBackOut } from "d3-ease";
import { CdkScrollable } from "@angular/cdk/scrolling";

import { Stream } from "src/app/models";
import { isTouchDevice, truncateTo15Seconds, within } from "src/utils";

@Component({
  selector: "hs-stream-stats-chart",
  templateUrl: "stream-stats-chart.html",
  styleUrls: ["stream-stats-chart.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamStatsChart implements OnInit, OnDestroy {
  constructor(private host: ElementRef<HTMLElement>) {}

  @Input() streamId: string;

  loading = false;

  dataPointIdx: number = -1;
  placement = isTouchDevice ? "top" : "right";
  referenceRect = null;

  @ViewChild("svg", { static: true })
  svg: ElementRef<HTMLElement>;

  readonly dataPointSize: number = 5;
  readonly height: number = 300;
  readonly leftMargin: number = 20;
  readonly rightMargin: number = 50;
  readonly topMargin: number = 10;
  readonly bottomMargin: number = 30;

  @Input() stream: Stream;
  @Input("rows") _raw: [number, number][] = [];

  rows: [number, number][] = [];
  xScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);
  yScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);
  xTicks: number[] = [];
  yTicks: number[] = [];
  areaPath: string;
  linePath: string;
  width: number = 0;

  step = 3;
  unit: number | "fit" = "fit";

  sub: Subscription | null;
  animation: Subscription | null;
  scrollSub: Subscription | null;

  @ViewChild(CdkScrollable, { static: true }) scrollable: CdkScrollable;

  ngOnInit() {
    this._render();

    // TODO: switch to resize observer
    this.sub = fromEvent(window, "resize")
      .pipe(
        filter(() => this.unit == "fit"),
        map(() => this.host.nativeElement.getBoundingClientRect().width),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe((w) => {
        this._render();
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.animation?.unsubscribe();
    this.scrollSub?.unsubscribe();
  }

  formatTimeUnit(unit: number | "fit"): string {
    if (unit === "fit") return "Fit";
    return unit >= 60000 ? `${unit / 60000}m` : `${unit / 1000}s`;
  }

  _render() {
    const hostWidth = this.host.nativeElement.getBoundingClientRect().width;

    if (typeof this.unit === "number") {
      this.rows = this._raw.filter(
        ([time]) => truncateTo15Seconds(time) % (this.unit as number) == 0
      );
      this.width = Math.max(this.rows.length * this.step, hostWidth);

      console.log(
        `[stream-chat] unit: ${this.unit} raw: ${this._raw.length} rows: ${this.rows.length}`
      );
    } else {
      const len = this._raw.length;

      const unit = Math.ceil((len * 2) / hostWidth);

      this.rows = this._raw.filter(
        ([time]) => truncateTo15Seconds(time) % unit == 0
      );
      this.width = hostWidth;

      console.log(
        `[stream-chat] unit: ${unit}(fit) raw: ${this._raw.length} rows: ${this.rows.length}`
      );
    }

    this.xScale
      .domain(extent(this.rows, (row) => row[0]))
      .range([this.leftMargin, this.width - this.rightMargin]);

    const step = Math.ceil(60 / (this.width / this.rows.length));

    this.xTicks = range(0, this.rows.length - 1, step);

    this.yScale
      .domain([0, max(this.rows, (row) => row[1])])
      .range([this.height + this.topMargin, this.topMargin]);

    this.yTicks = this.yScale.ticks(6);

    const self = this;
    const start = new Date().getTime();
    const ms = 400;
    const ease = easeBackOut.overshoot(0.4);

    this.animation?.unsubscribe();

    this.animation = animationFrameScheduler.schedule(function (t) {
      const curr = new Date().getTime();

      const p = Math.min(1, (curr - start) / ms);
      const e = ease(p);

      self.areaPath = area()
        .curve(curveLinear)
        .x((d) => self.xScale(d[0]))
        .y0(self.yScale(0))
        .y1((d) => self.yScale(d[1] * e))(self.rows);

      self.linePath = line()
        .curve(curveLinear)
        .x((d) => self.xScale(d[0]))
        .y((d) => self.yScale(d[1] * e))(self.rows);

      if (p < 1) this.schedule();
    }, 0);

    if (!this.scrollSub) {
      this.scrollSub = this.scrollable.elementScrolled().subscribe((event) => {
        this.closeTooltip();
      });
    }
  }

  tryOpenTooltip(e: MouseEvent | TouchEvent) {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const { x, y, top, left } = this.svg.nativeElement.getBoundingClientRect();

    const offsetX = clientX - x;
    const offsetY = clientY - y;

    const idx = bisectCenter(
      this.rows.map((x) => x[0]),
      this.xScale.invert(offsetX)
    );

    if (
      within(idx, 0, this.rows.length - 1) &&
      within(offsetY, this.topMargin, this.topMargin + this.height)
    ) {
      this.dataPointIdx = idx;
      const x = left + this.xScale(this.rows[idx][0]);
      const y = top + this.yScale(this.rows[idx][1]);
      this.referenceRect = {
        width: 0,
        height: 0,
        right: x,
        left: x,
        top: y,
        bottom: y,
      };
    } else {
      this.closeTooltip();
    }
  }

  closeTooltip() {
    this.dataPointIdx = -1;
  }

  jumpTo(e: MouseEvent) {
    if (this.stream.status !== "ended") return;

    const { x, y } = this.svg.nativeElement.getBoundingClientRect();

    const offsetX = e.clientX - x;
    const offsetY = e.clientY - y;

    const idx = bisectCenter(
      this.rows.map((x) => x[0]),
      this.xScale.invert(offsetX)
    );

    if (
      within(idx, 0, this.rows.length - 1) &&
      within(offsetY, this.topMargin, this.topMargin + this.height) &&
      this.rows[idx][0] > this.stream.startTime
    ) {
      const t = Math.round((this.rows[idx][0] - this.stream.startTime) / 1000);

      window.open(`https://youtu.be/${this.stream.streamId}?t=${t}s`, "_blank");
    }
  }
}

@Component({
  selector: "hs-stream-stats-chart-shimmer",
  template: `
    <hs-sub-menu>
      <hs-sub-menu-title>
        <span class="text shimmer" [style.width.px]="90"></span>
      </hs-sub-menu-title>

      <hs-sub-menu-extra>
        <span class="shimmer text" [style.width.px]="120"></span>
      </hs-sub-menu-extra>
    </hs-sub-menu>
    <div class="shimmer" [style.height.px]="350"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamStatsChartShimmer {}
