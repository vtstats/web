import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { Placement } from "@floating-ui/core";
import type { Offset } from "@floating-ui/core/src/middleware/offset";
import {
  arrow,
  computePosition,
  flip,
  hide,
  offset,
  shift,
} from "@floating-ui/dom";

type Rect = {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

@Directive({
  selector: "[tooltip]",
})
export class TooltipDirective implements OnChanges {
  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  @Input() tooltipArrow: HTMLElement = null;
  @Input() tooltipContextElement: HTMLElement;
  @Input() tooltipFlip: any = {};
  @Input() tooltipOffset: Offset = 8;
  @Input() tooltipPlacement: Placement = "right";
  @Input() tooltipReferenceRect: Rect;
  @Input() tooltipShift: boolean = true;

  ngOnChanges(c: SimpleChanges) {
    if (
      this.tooltipReferenceRect &&
      "tooltipReferenceRect" in c &&
      !this._isRectSame(c.tooltipReferenceRect)
    ) {
      this._show();
    }
  }

  private _isRectSame(c: SimpleChange) {
    return (
      c.previousValue &&
      c.currentValue &&
      c.previousValue.width === c.currentValue.width &&
      c.previousValue.height === c.currentValue.height &&
      c.previousValue.top === c.currentValue.top &&
      c.previousValue.right === c.currentValue.right &&
      c.previousValue.bottom === c.currentValue.bottom &&
      c.previousValue.left === c.currentValue.left
    );
  }

  private _show() {
    Promise.resolve()
      .then(() =>
        computePosition(
          {
            getBoundingClientRect: () => this.tooltipReferenceRect as any,
            contextElement: this.tooltipContextElement,
          },
          this._el.nativeElement,
          {
            placement: this.tooltipPlacement,
            middleware: [
              this.tooltipOffset && offset(this.tooltipOffset),
              this.tooltipFlip && flip(this.tooltipFlip),
              this.tooltipShift && shift(),
              // NOTE: arrow() should always apply after shift()
              this.tooltipArrow && arrow({ element: this.tooltipArrow }),
              hide(),
            ].filter(Boolean),
          }
        )
      )
      .then(({ x, y, placement, strategy, middlewareData }) => {
        if (!this.tooltipReferenceRect) return;

        if (middlewareData.hide.referenceHidden) {
          this._renderer.setStyle(
            this._el.nativeElement,
            "visibility",
            "hidden"
          );
          return;
        }

        if (this.tooltipArrow && middlewareData.arrow) {
          const { x, y } = middlewareData.arrow;

          if (x) {
            this._renderer.setStyle(this.tooltipArrow, "left", x + "px");
          } else {
            this._renderer.removeStyle(this.tooltipArrow, "left");
          }

          if (y) {
            this._renderer.setStyle(this.tooltipArrow, "top", y + "px");
          } else {
            this._renderer.removeStyle(this.tooltipArrow, "top");
          }

          this._renderer.setAttribute(
            this.tooltipArrow,
            "data-placement",
            placement
          );
        }

        this._renderer.setStyle(
          this._el.nativeElement,
          "transform",
          `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`
        );

        this._renderer.setStyle(this._el.nativeElement, "position", strategy);
        this._renderer.setStyle(
          this._el.nativeElement,
          "visibility",
          "visible"
        );
      });
  }
}
