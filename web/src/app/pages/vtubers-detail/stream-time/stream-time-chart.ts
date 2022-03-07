import { CdkScrollable } from "@angular/cdk/scrolling";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { subWeeks } from "date-fns";
import { Subscription } from "rxjs";

@Component({ template: "" })
export class StreamTimeChart implements OnInit, OnDestroy {
  popperIdx = -1;
  referenceRect = null;

  private scroll$: Subscription | null;

  @ViewChild("svg")
  private svg: ElementRef<HTMLElement>;

  @ViewChild(CdkScrollable, { static: true })
  private scrollable: CdkScrollable;

  @Input() loading: boolean;
  @Input() times: [number, number][];

  constructor(private cdr: ChangeDetectorRef) {}

  max = new Date();
  min = subWeeks(this.max, 44);

  get total(): number {
    return this.times.reduce((acc, cur) => acc + cur[1], 0);
  }

  getItemByOffset(
    offsetX: number,
    offsetY: number
  ): { idx: number; x: number; y: number; width: number; height: number } {
    return { idx: -1, x: 0, y: 0, width: 0, height: 0 };
  }

  ngOnInit() {
    this.scroll$ = this.scrollable.elementScrolled().subscribe(() => {
      this.closeTooltip();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.scroll$) this.scroll$.unsubscribe();
  }

  tryOpenTooltip(e: MouseEvent | TouchEvent) {
    if (this.loading) return;

    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;

    const { x, y, left, top } = this.svg.nativeElement.getBoundingClientRect();

    const offsetX = clientX - x;
    const offsetY = clientY - y;

    const item = this.getItemByOffset(offsetX, offsetY);

    if (item.idx >= 0) {
      if (this.popperIdx === item.idx) return;

      const x = left + item.x;
      const y = top + item.y;

      this.referenceRect = {
        width: item.width,
        height: item.height,
        right: x,
        left: x,
        top: y,
        bottom: y,
      };
      this.popperIdx = item.idx;
    } else {
      this.closeTooltip();
    }
  }

  closeTooltip() {
    this.popperIdx = -1;
  }
}
