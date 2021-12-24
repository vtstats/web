import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Placement } from "@floating-ui/core";
import {
  flip,
  offset,
  arrow,
  computePosition,
  shift,
  hide,
} from "@floating-ui/dom";
import type { Offset } from "@floating-ui/core/src/middleware/offset";

@Component({
  selector: "hs-popper",
  templateUrl: "popper.html",
  styleUrls: ["./popper.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PopperComponent {
  @ViewChild("popper", { static: true })
  popper: ElementRef<HTMLElement>;
  @ViewChild("arrow", { static: true })
  arrowEl: ElementRef<HTMLElement>;

  @Input() class: string = "hs-popper-styled";
  @Input() placement: Placement = "right";
  @Input() arrow: boolean = false;
  @Input() shift: boolean = true;
  @Input() offset: Offset = 8;
  @Input() flip: any = {};

  public hide() {
    Object.assign(this.popper.nativeElement.style, {
      visibility: "hidden",
    });
  }

  public update(reference: Element) {
    setTimeout(() => {
      computePosition(reference, this.popper.nativeElement, {
        placement: this.placement,
        middleware: [
          this.offset && offset(this.offset),
          this.flip && flip(this.flip),
          this.shift && shift(),
          // NOTE: arrow() should always apply after shift()
          this.arrow && arrow({ element: this.arrowEl.nativeElement }),
          hide(),
        ].filter(Boolean),
      }).then(({ x, y, placement, strategy, middlewareData }) => {
        if (middlewareData.hide.referenceHidden) {
          Object.assign(this.popper.nativeElement.style, {
            visibility: "hidden",
          });
          return;
        }

        if (middlewareData.arrow) {
          const { x = 0, y = 0 } = middlewareData.arrow;

          Object.assign(this.arrowEl.nativeElement.style, {
            left: x ? x + "px" : undefined,
            top: y ? y + "px" : undefined,
          });

          this.arrowEl.nativeElement.dataset.placement = placement;
        }

        Object.assign(this.popper.nativeElement.style, {
          transform: `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`,
          position: strategy,
          visibility: "visible",
        });
      });
    }, 0);
  }
}
