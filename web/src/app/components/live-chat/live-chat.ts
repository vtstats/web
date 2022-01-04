import { animate, style, transition, trigger } from "@angular/animations";
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { range, max, extent } from "d3-array";
import { ScaleLinear, scaleLinear } from "d3-scale";
import { fromEvent, Subscription } from "rxjs";
import {
  debounceTime,
  filter,
  map,
  distinctUntilChanged,
} from "rxjs/operators";

import { Stream } from "src/app/models";
import { isTouchDevice, within } from "src/utils";

@Component({
  selector: "hs-live-chat",
  templateUrl: "live-chat.html",
  styleUrls: ["live-chat.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("bar", [
      transition(":enter", [
        style({ "clip-path": "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }),
        animate(
          400,
          style({ "clip-path": "polygon(0 0, 100% 0, 100% 100%, 0 100%)" })
        ),
      ]),
    ]),
  ],
})
export class LiveChat implements OnInit, OnDestroy {
  constructor(private host: ElementRef<HTMLElement>) {}

  loading = false;

  dataIndex = -1;
  offset = ({ placement }) => {
    if (placement.endsWith("-start")) {
      return { mainAxis: 16, crossAxis: 16 };
    } else if (placement.endsWith("-end")) {
      return { mainAxis: 16, crossAxis: -16 };
    }

    return { mainAxis: 32 };
  };
  placement = isTouchDevice ? "top" : "bottom-start";
  flip = isTouchDevice ? false : { padding: 32 };
  referenceRect = null;

  @ViewChild("svg", { static: true })
  private svg: ElementRef<HTMLElement>;

  readonly barWidth: number = 9;
  readonly innerPadding: number = 3;
  readonly height: number = 300;

  readonly leftMargin: number = 20;
  readonly rightMargin: number = 20;
  readonly topMargin: number = 10;
  readonly bottomMargin: number = 30;

  @Input("rows") _raw: [number, number, number][];
  @Input() stream: Stream;

  sub: Subscription;
  rows: [number, number, number, number][] = [];
  xScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);
  yScale: ScaleLinear<number, number> = scaleLinear().domain([0, 0]);
  yTicks: number[] = [];
  xTicks: number[] = [];

  unit: number | "fit" = "fit";

  width = 0;

  ngOnInit() {
    this._render();

    // TODO: switch to resize observer
    this.sub = fromEvent(window, "resize")
      .pipe(
        filter(() => this.unit === "fit"),
        map(() => this.host.nativeElement.getBoundingClientRect().width),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(() => this._render());
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  changeTimeUnit(unit: number | "fit") {
    this.unit = unit;
    this.closeTooltip();
    this._render();
  }

  formatTimeUnit(unit: number | "fit"): string {
    if (unit === "fit") return "Fit";
    return unit >= 60000 ? `${unit / 60000}m` : `${unit / 1000}s`;
  }

  _render() {
    const hostWidth = this.host.nativeElement.getBoundingClientRect().width;

    if (typeof this.unit === "number") {
      this._agg(this.unit);
      this.width = Math.max(
        this.rows.length * (this.barWidth + this.innerPadding),
        hostWidth
      );

      console.log(
        `[live-chat] unit: ${this.unit} raw: ${this._raw.length} rows: ${this.rows.length}`
      );
    } else {
      const n = Math.floor(
        (hostWidth - this.leftMargin - this.rightMargin) /
          (this.barWidth + this.innerPadding)
      );

      const [min, max] = extent(this._raw, (row) => row[0]);

      const unit = Math.ceil((max - min) / n / 15000) * 15000;

      this._agg(unit);
      this.width = hostWidth;

      console.log(
        `[live-chat] unit: ${unit}(fit) raw: ${this._raw.length} rows: ${this.rows.length}`
      );
    }

    const m = Math.max(
      0,
      (hostWidth - this.rows.length * (this.barWidth + this.innerPadding)) / 2
    );

    this.xScale
      .domain([0, this.rows.length]) // n+1
      .range([this.leftMargin + m, this.width - this.rightMargin - m]);

    this.yScale
      .domain([0, max(this.rows, (row) => row[2])])
      .range([this.height + this.topMargin, this.topMargin]);

    this.xTicks = range(
      this.rows.findIndex((r) => r[0] % 60000 === 0),
      this.rows.length,
      8
    );

    this.yTicks = this.yScale.ticks(6);
  }

  private _agg(unit: number) {
    this._raw = this._raw.sort((a, b) => a[0] - b[0]);

    this.rows = [];

    for (const row of this._raw) {
      const l = this.rows[this.rows.length - 1];
      const t = row[0];

      if (!l || !(t < l[1])) {
        const s = t - (t % unit);
        this.rows.push([s, s + unit, row[1], row[2]]);
      } else {
        this.rows[this.rows.length - 1][2] += row[1];
        this.rows[this.rows.length - 1][3] += row[2];
      }
    }
  }

  tryOpenTooltip(e: MouseEvent | TouchEvent) {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;

    const { x, y } = this.svg.nativeElement.getBoundingClientRect();

    const offsetX = clientX - x;
    const offsetY = clientY - y;

    const idx = Math.floor(this.xScale.invert(offsetX));

    if (
      within(idx, 0, this.rows.length - 1) &&
      within(offsetY, this.topMargin, this.topMargin + this.height)
    ) {
      this.dataIndex = idx;
      this.referenceRect = {
        width: 0,
        height: 0,
        top: clientY,
        right: clientX,
        bottom: clientY,
        left: clientX,
      };
    } else {
      this.closeTooltip();
    }
  }

  jumpTo(e: MouseEvent) {
    const { x, y } = this.svg.nativeElement.getBoundingClientRect();

    const offsetX = e.clientX - x;
    const offsetY = e.clientY - y;

    const idx = Math.floor(this.xScale.invert(offsetX));

    if (
      !this.loading &&
      this.stream.status === "ended" &&
      within(idx, 0, this.rows.length - 1) &&
      within(offsetY, this.topMargin, this.topMargin + this.height) &&
      this.rows[idx][0] > this.stream.startTime
    ) {
      const t = Math.round((this.rows[idx][0] - this.stream.startTime) / 1000);

      window.open(`https://youtu.be/${this.stream.streamId}?t=${t}s`, "_blank");
    }
  }

  closeTooltip() {
    this.dataIndex = -1;
  }
}
