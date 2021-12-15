import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { lightFormat } from "date-fns";
import SVG from "svg.js";
import { fromEvent, Subscription } from "rxjs";
import {
  debounceTime,
  filter,
  map,
  distinctUntilChanged,
} from "rxjs/operators";

import { PopperComponent } from "../popper/popper";
import { Stream } from "src/app/models";

@Component({
  selector: "hs-stream-stats-chart",
  templateUrl: "stream-stats-chart.html",
  styleUrls: ["stream-stats-chart.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamStatsChart implements OnInit, OnDestroy {
  constructor(private ngZone: NgZone, private host: ElementRef<HTMLElement>) {}

  @Input() streamId: string;

  loading = false;

  @ViewChild("popperComp")
  popperComp: PopperComponent;

  popper = {
    idx: 0,
    date: 0,
    value: 0,
  };

  @ViewChild("bars", { static: true })
  private lineEl: ElementRef;
  private lineSvg: SVG.Doc;

  private guideLine: SVG.Line;
  private dataPoint: SVG.Circle;

  readonly dataPointSize: number = 5;
  readonly height: number = 300;
  readonly leftMargin: number = 20;
  readonly rightMargin: number = 50;
  readonly topMargin: number = 10;
  readonly bottomMargin: number = 30;

  @Input() rows: [number, number][];
  @Input() stream: Stream;

  scale = 1;
  max = 300;
  step = 2;
  timeUnit = 15_000;
  fitContent = true;

  sub: Subscription;

  ngOnInit() {
    this._render();

    // TODO: switch to resize observer
    this.sub = fromEvent(window, "resize")
      .pipe(
        filter(() => this.fitContent),
        map(() => this.host.nativeElement.getBoundingClientRect().width),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe((w) => this._render(w));
  }

  ngOnDestroy() {
    if (this.lineSvg) {
      this.lineSvg.off("mousemove");
      this.lineSvg.off("mouseleave");
      this.lineSvg.clear();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  formatTimeUnit(unit: number): string {
    return unit >= 60000 ? `${unit / 60000}m` : `${unit / 1000}s`;
  }

  _render(w?: number) {
    if (!w) {
      w = this.host.nativeElement.getBoundingClientRect().width;
    }

    const len = this.rows.length - 1;

    const width = w - (this.leftMargin + this.rightMargin);

    if (this.fitContent) {
      const unit = Math.ceil((len * 2) / width);

      this.timeUnit = unit * 15000;
      this.step = +((width * unit) / len).toFixed(2);
    }

    this.step = +((width * this.timeUnit) / 15000 / len).toFixed(2);

    this.step = Math.max(2, this.step);

    const rows = this._agg();
    this.max = Math.max(...rows.map((r) => r[1]));
    this.scale = this.height / this.max;

    this.ngZone.runOutsideAngular(() => this._drawSvg(rows));
  }

  private _agg(): [number, number][] {
    const ret = [];
    const sorted = this.rows.sort((a, b) => a[0] - b[0]);
    const step = this.timeUnit / 15_000;

    for (let index = 0; index < sorted.length; index += step) {
      const element = sorted[index];
      ret.push(element);
    }

    return ret;
  }

  private _drawSvg(rows: [number, number][]) {
    if (this.lineSvg) {
      this.lineSvg.off("mousemove");
      this.lineSvg.off("mouseleave");
      this.lineSvg.off("touchmove");
      this.lineSvg.off("dblclick");
      this.lineSvg.clear();
    } else {
      this.lineSvg = SVG(this.lineEl.nativeElement);
    }

    this.lineSvg.size(
      this.leftMargin + (rows.length - 1) * this.step + this.rightMargin,
      this.topMargin + this.height + this.bottomMargin
    );

    // line and gradient
    {
      const points = [];

      for (const [idx, [at, v]] of rows.entries()) {
        const h = +(v * this.scale).toFixed(2);
        points.push([
          this.leftMargin + idx * this.step,
          this.topMargin + this.height - h,
        ]);
      }

      const line = this.lineSvg
        .polyline(points.map((p) => [p[0], this.topMargin + this.height]))
        .fill("none")
        .stroke({
          color: "rgb(234, 67, 53)",
          width: 2,
          dasharray: "none",
        });

      (line as any).animate(300).plot(points);

      const linear = this.lineSvg
        .gradient("linear", function (stop) {
          stop.at({ offset: 0, color: "#EA4335", opacity: 0.38 });
          stop.at({ offset: 0.9, color: "#FCDEE5", opacity: 0 });
        })
        .from(0, 0)
        .to(0, 1);

      const path = this.lineSvg
        .path([
          ["M", this.leftMargin, this.topMargin + this.height],
          ...points.map((p) => ["L", p[0], this.topMargin + this.height]),
          [
            "L",
            this.leftMargin + this.step * (rows.length - 1),
            this.topMargin + this.height,
          ],
        ])
        .fill(linear);

      (path as any)
        .animate(300)
        .plot([
          ["M", this.leftMargin, this.topMargin + this.height],
          ...points.map((p) => ["L", p[0], p[1]]),
          [
            "L",
            this.leftMargin + this.step * (rows.length - 1),
            this.topMargin + this.height,
          ],
        ]);
    }

    // labels
    {
      const inc = Math.ceil(60 / this.step);

      for (let index = 1; index < rows.length; index += inc) {
        this.lineSvg
          .line([
            this.leftMargin + index * this.step,
            this.topMargin + this.height,
            this.leftMargin + index * this.step,
            this.topMargin + this.height + 6,
          ])
          .addClass("line")
          .stroke({ width: 1, color: "#E6E6E6" });

        this.lineSvg
          .text(lightFormat(rows[index][0], "HH:mm"))
          .addClass("label")
          .move(
            this.leftMargin + index * this.step,
            this.topMargin + this.height + 8
          )
          .font({ anchor: "middle", family: "Fira Code" });
      }
    }

    // guide line and data point
    {
      this.guideLine = this.lineSvg
        .line([
          [0, 0],
          [0, this.topMargin + this.height],
        ])
        .addClass("guideline")
        .stroke({
          width: 2,
          linecap: "round",
          dasharray: "1.5, 6",
        })
        .fill("noone")
        .move(-2434, 0);

      this.dataPoint = this.lineSvg
        .circle(this.dataPointSize * 2)
        .fill("rgb(234, 67, 53)")
        .move(-2434, 0);
    }

    this.lineSvg.on("mousemove", (e: MouseEvent) =>
      this._handleMousemove(e, rows)
    );

    this.lineSvg.on("mouseleave", this._handleMouseleave, this);

    this.lineSvg.on("touchmove", (e: TouchEvent) =>
      this._handleTouchmove(e, rows)
    );

    this.lineSvg.on("dblclick", (e) => this._handleDblClick(e, rows), this);
  }

  _handleMousemove(e: MouseEvent, rows: [number, number][]) {
    if (
      e.target instanceof Element &&
      ["svg", "path"].includes(e.target.tagName.toLowerCase())
    ) {
      const x =
        this.lineEl.nativeElement.scrollLeft +
        e.clientX -
        this.lineEl.nativeElement.getBoundingClientRect().x -
        this.leftMargin;

      this._updateGuideline(x, rows);
    }
  }

  _handleTouchmove(e: TouchEvent, rows: [number, number][]) {
    const x =
      this.lineEl.nativeElement.scrollLeft +
      e.touches[0].clientX -
      this.lineEl.nativeElement.getBoundingClientRect().x;

    const currentX = this.guideLine.attr("x1");

    if (Math.abs(x - currentX) > 30) return;

    if (e.cancelable) {
      e.preventDefault();
      this._updateGuideline(x - this.leftMargin, rows);
    }
  }

  _handleDblClick(e: MouseEvent, rows: [number, number][]) {
    if (this.stream.status !== "ended") return;

    const x =
      this.lineEl.nativeElement.scrollLeft +
      e.clientX -
      this.lineEl.nativeElement.getBoundingClientRect().x -
      this.leftMargin;

    const idx = Math.round(x / this.step);

    if (0 <= idx && idx <= rows.length - 1) {
      window.open(
        `https://youtu.be/${this.stream.streamId}?t=${Math.max(
          0,
          Math.round((rows[idx][0] - this.stream.startTime) / 1000)
        )}s`,
        "_blank"
      );
    }
  }

  _updateGuideline(x: number, rows: [number, number][]) {
    const idx = Math.min(
      Math.max(0, Math.round(x / this.step)),
      rows.length - 1
    );

    if (this.popper.idx === idx) return;

    const [d, v] = rows[idx];

    const h = +(v * this.scale).toFixed(2);

    this.guideLine.move(this.leftMargin + idx * this.step, 0);
    this.dataPoint.move(
      this.leftMargin + idx * this.step - this.dataPointSize,
      this.topMargin + this.height - h - this.dataPointSize
    );

    this.ngZone.run(() => {
      this.popper.idx = idx;
      this.popper.date = d;
      this.popper.value = v;
    });

    // popper reposition
    this.popperComp.update(this.dataPoint.node);
  }

  _handleMouseleave() {
    this.guideLine.move(-2434, 0);
    this.dataPoint.move(-2434, 0);
    this.popperComp.hide();
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
