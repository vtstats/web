import {
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
import { ScaleLinear, scaleLinear } from "d3-scale";

import { Stream } from "src/app/models";
import { PopperComponent } from "../popper/popper";

@Component({
  selector: "hs-live-chat",
  templateUrl: "live-chat.html",
  styleUrls: ["live-chat.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LiveChat implements OnInit, OnDestroy {
  constructor(private ngZone: NgZone, private host: ElementRef<HTMLElement>) {}

  loading = false;

  @ViewChild("popperComp")
  popperComp: PopperComponent;

  popper = {
    from: 0,
    to: 0,
    total: 0,
    member: 0,
  };

  @ViewChild("bars", { static: true })
  private barsEl: ElementRef;
  private barsSvg: SVG.Doc;

  readonly barWidth: number = 9;
  readonly innerPadding: number = 3;
  readonly height: number = 300;

  readonly leftMargin: number = 20;
  readonly rightMargin: number = 20;
  readonly topMargin: number = 10;
  readonly bottomMargin: number = 30;

  @Input() rows: [number, number, number][];

  sub: Subscription;

  scale: ScaleLinear<number, number> = scaleLinear();
  max = 300;
  timeUnit = 15000;
  fitContent = true;

  @Input() stream: Stream;

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
    if (this.barsSvg) this.barsSvg.clear();
    if (this.sub) this.sub.unsubscribe();
  }

  formatTimeUnit(unit: number): string {
    return unit >= 60000 ? `${unit / 60000}m` : `${unit / 1000}s`;
  }

  _render(width?: number) {
    if (!width) {
      width = this.host.nativeElement.getBoundingClientRect().width;
    }

    if (this.fitContent) {
      const n = Math.floor((width - 120) / (this.barWidth + this.innerPadding));

      this.timeUnit =
        Math.ceil(
          (this.rows[this.rows.length - 1][0] - this.rows[0][0]) / n / 15000
        ) * 15000;
    }

    const rows = this._agg();
    this.max = Math.max(...rows.map((r) => r[2]));
    this.scale.domain([0, this.max]).range([0, this.height]);
    this.ngZone.runOutsideAngular(() => this._drawBars(rows));
  }

  private _agg(): [number, number, number, number][] {
    const ret = [];
    const sorted = this.rows.sort((a, b) => a[0] - b[0]);

    if (sorted[0][0] < this.stream.startTime) {
      ret.push([
        sorted[0][0],
        this.stream.startTime - (this.stream.startTime % this.timeUnit),
        sorted[0][1],
        sorted[0][2],
      ]);
    }

    for (const row of sorted) {
      const l = ret[ret.length - 1];
      const t = row[0];

      if (!l || !(l[0] <= t && t <= l[1])) {
        const s = t - (t % this.timeUnit);
        ret.push([s, s + this.timeUnit, row[1], row[2]]);
      } else {
        ret[ret.length - 1][2] += row[1];
        ret[ret.length - 1][3] += row[2];
      }
    }

    return ret;
  }

  private _drawBars(rows: [number, number, number, number][]) {
    if (this.barsSvg) {
      this.barsSvg.clear();
    } else {
      this.barsSvg = SVG(this.barsEl.nativeElement);
    }

    this.barsSvg.size(
      this.leftMargin +
        rows.length * (this.barWidth + this.innerPadding) +
        this.rightMargin,
      this.topMargin + this.height + this.bottomMargin
    );

    const g1 = this.barsSvg.group();

    const g2 = this.barsSvg.group().style({ "pointer-events": "none" });

    for (const [idx, [from, to, v1, v2]] of rows.entries()) {
      const h1 = this.scale(v1);
      g1.rect(this.barWidth, 0)
        .fill("#B7A8F4")
        .radius(2, 2)
        .move(
          this.leftMargin + idx * (this.barWidth + this.innerPadding),
          this.topMargin + this.height
        )
        .attr({ "x-from": from, "x-to": to, "x-v1": v1, "x-v2": v2 })
        .animate(300)
        .attr("height", h1)
        .move(
          this.leftMargin + idx * (this.barWidth + this.innerPadding),
          this.topMargin + this.height - h1
        );

      if (v2 !== 0) {
        const h2 = this.scale(v2);
        g2.rect(this.barWidth, 0)
          .fill("#855CF8")
          .radius(2, 2)
          .move(
            this.leftMargin + idx * (this.barWidth + this.innerPadding),
            this.topMargin + this.height
          )
          .animate(300)
          .attr("height", h2)
          .move(
            this.leftMargin + idx * (this.barWidth + this.innerPadding),
            this.topMargin + this.height - h2
          );
      }
    }

    for (let index = 0; index < rows.length; index += 5) {
      const x =
        this.leftMargin +
        index * (this.barWidth + this.innerPadding) +
        this.barWidth / 2;

      const y = this.topMargin + this.height;

      this.barsSvg
        .line([x, y, x, y + 6])
        .addClass("line")
        .stroke({ width: 1, color: "#E6E6E6" });

      this.barsSvg
        .text(lightFormat(rows[index][0], "HH:mm"))
        .move(x, y + 8)
        .addClass("x label")
        .font({ anchor: "middle", family: "Fira Code" });
    }
  }

  _handleMouseleave() {
    this.popperComp.hide();
  }

  _handleMouseover(e: MouseEvent) {
    if (
      !this.loading &&
      e.target instanceof Element &&
      e.target.tagName.toLowerCase() === "rect"
    ) {
      this.popper.from = Number(e.target.getAttribute("x-from"));
      this.popper.to = Number(e.target.getAttribute("x-to"));
      this.popper.total = Number(e.target.getAttribute("x-v1"));
      this.popper.member = Number(e.target.getAttribute("x-v2"));
      this.popperComp.update(e.target);
    }
  }

  _handleDblClick(e: MouseEvent) {
    if (
      !this.loading &&
      this.stream.status === "ended" &&
      e.target instanceof Element &&
      e.target.tagName.toLowerCase() === "rect"
    ) {
      const from = Number(e.target.getAttribute("x-from"));
      window.open(
        `https://youtu.be/${this.stream.streamId}?t=${Math.max(
          0,
          Math.round((from - this.stream.startTime) / 1000)
        )}s`,
        "_blank"
      );
    }
  }
}
