import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { bisectCenter, extent } from "d3-array";
import { easeBackOut } from "d3-ease";
import { ScaleLinear, scaleLinear } from "d3-scale";
import { area, curveLinear, line } from "d3-shape";
import {
  animationFrameScheduler,
  fromEvent,
  interval,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeWhile,
} from "rxjs";
import { within } from "src/utils";

@Component({
  selector: "hls-channel-stats-chart",
  templateUrl: "channel-stats-chart.html",
  styleUrls: ["channel-stats-chart.scss"],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelStatsChart implements OnInit, OnDestroy {
  @Input() schame: "youtube" | "bilibili";
  @Input() name: string;
  @Input() loading: boolean;
  @Input() showTime: boolean;

  _dataPointIdx: number;

  @Input() set dataPointIdx(idx: number) {
    this._dataPointIdx = idx;

    if (within(idx, 0, this.rows.length - 1)) {
      const { top, left } = this.svg.nativeElement.getBoundingClientRect();

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
    }
  }
  @Output() dataPointIdxChange = new EventEmitter<number>();

  referenceRect = null;

  @ViewChild("svg", { static: true })
  svg: ElementRef<HTMLElement>;

  readonly dataPointSize: number = 3;
  readonly height: number = 64;
  readonly leftMargin: number = 8;
  readonly rightMargin: number = 8;
  readonly topMargin: number = 8;
  readonly bottomMargin: number = 8;

  @Input() rows: [number, number][] = [];

  xScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);
  yScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);
  areaPath: string;
  linePath: string;

  animate$: Subscription | null;
  resize$: Subscription | null;

  ngOnInit() {
    // TODO: switch to resize observer
    this.resize$ = fromEvent(window, "resize")
      .pipe(
        debounceTime(500),
        startWith(null),
        map(() => this.svg.nativeElement.getBoundingClientRect().width),
        distinctUntilChanged()
      )
      .subscribe((w) => {
        this._render(w);
      });
  }

  ngOnDestroy() {
    this.resize$?.unsubscribe();
    this.animate$?.unsubscribe();
  }

  private _render(width: number) {
    if (this.rows.length === 0) return;

    this.xScale
      .domain(extent(this.rows, (row) => row[0]))
      .range([this.leftMargin, width - this.rightMargin]);

    if (this.loading) return;

    this.yScale
      .domain(extent(this.rows, (row) => row[1]))
      .range([this.height + this.topMargin, this.topMargin]);

    const start = animationFrameScheduler.now();
    const ms = 600;
    const ease = easeBackOut.overshoot(0.4);

    this.animate$?.unsubscribe();

    this.animate$ = interval(10, animationFrameScheduler)
      .pipe(
        map(() => (animationFrameScheduler.now() - start) / ms),
        takeWhile((progress) => progress <= 1, true),
        map((progress) => {
          const e = ease(Math.min(progress, 1));

          this.areaPath = area()
            .curve(curveLinear)
            .x((d) => this.xScale(d[0]))
            .y0(this.topMargin + this.height + this.bottomMargin)
            .y1((d) => this.yScale(d[1] * e))(this.rows);

          this.linePath = line()
            .curve(curveLinear)
            .x((d) => this.xScale(d[0]))
            .y((d) => this.yScale(d[1] * e))(this.rows);
        })
      )
      .subscribe();
  }

  tryOpenTooltip(e: MouseEvent | TouchEvent) {
    if (this.loading) return;

    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const { x, y } = this.svg.nativeElement.getBoundingClientRect();

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
      this.dataPointIdxChange.emit(idx);
    } else {
      this.closeTooltip();
    }
  }

  closeTooltip() {
    this.dataPointIdxChange.emit(-1);
  }
}

@Component({
  selector: "hls-stream-stats-chart-shimmer",
  template: `
    <!-- <hls-sub-menu>
      <hls-sub-menu-title>
        <span class="text shimmer" [style.width.px]="90"></span>
      </hls-sub-menu-title>

      <hls-sub-menu-extra>
        <span class="shimmer text" [style.width.px]="120"></span>
      </hls-sub-menu-extra>
    </hls-sub-menu>
    <div class="shimmer" [style.height.px]="350"></div> -->
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamStatsChartShimmer {}
