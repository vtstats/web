import { formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  NgZone,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import SVG from "svg.js";

@Component({
  selector: "hs-chart-axis",
  templateUrl: "./chart-axis.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartAxis implements OnDestroy, OnChanges {
  constructor(
    private ngZone: NgZone,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  @ViewChild("axis", { static: true })
  private el: ElementRef;

  private svg: SVG.Doc;

  @Input() height: number = 300;
  @Input() topMargin: number = 10;
  @Input() bottomMargin: number = 30;
  @Input() max: number = 300;
  @Input() width: number = 960;

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => this._render());
  }

  ngOnDestroy() {
    if (this.svg) this.svg.clear();
  }

  private _render() {
    let scale = this.height / this.max;
    let unit = this.max / 5;

    if (this.max >= 1000) {
      unit -= unit % 100;
    } else if (this.max >= 100) {
      unit -= unit % 10;
    }

    unit = Math.floor(unit);

    if (this.svg) {
      this.svg.clear();
    } else {
      this.svg = SVG(this.el.nativeElement).size(
        this.width,
        this.topMargin + this.height + 1
      );
    }

    this.svg
      .line([
        0,
        this.topMargin + this.height,
        this.width,
        this.topMargin + this.height,
      ])
      .addClass("line")
      .stroke({ width: 1, color: "#E6E6E6" });

    for (let i = 1; i <= 6; i++) {
      const v = i * unit;

      if (v > this.max) break;

      const y = this.topMargin + (this.max - v) * scale;

      this.svg
        .line([0, y, this.width, y])
        .addClass("line")
        .stroke({ width: 1, color: "#E6E6E6" });

      this.svg
        .text(formatNumber(v, this.locale))
        .addClass("label")
        .move(this.width - 8, y + 8)
        .font({ anchor: "end", family: "Fira Code" });
    }
  }
}
