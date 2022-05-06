import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

import { isTouchDevice } from "src/utils";

@Directive({
  selector: "[holdGesture]",
})
export class HoldGestureDirective {
  holding: boolean = false;

  initialX = 0;
  initialY = 0;

  timeout: any;

  readonly timeoutMs = 500;
  readonly delta = 50;

  @Output("release")
  onRelease = new EventEmitter<TouchEvent | MouseEvent>();

  @Output("hold")
  onHold = new EventEmitter<TouchEvent | MouseEvent>();

  @HostListener("touchstart", ["$event"])
  touchstart(event: TouchEvent) {
    if (event.touches.length !== 1) return;

    const { clientX, clientY } = event.touches[0];

    this.initialX = clientX;
    this.initialY = clientY;
    this.timeout = setTimeout(() => {
      this.holding = true;
      this.onHold.emit(event);
    }, this.timeoutMs);
  }

  @HostListener("touchmove", ["$event"])
  touchmove(event: TouchEvent) {
    if (this.holding) {
      this.onHold.emit(event);

      // preventDefault
      if (event.cancelable) {
        return false;
      }
    }

    if (event.touches.length !== 1) return;

    const { clientX, clientY } = event.touches[0];

    if (
      Math.abs(clientX - this.initialX) > this.delta ||
      Math.abs(clientY - this.initialY) > this.delta
    ) {
      this.holding = false;
      clearTimeout(this.timeout);
    }
  }

  @HostListener("touchend", ["$event"])
  @HostListener("touchcancel", ["$event"])
  touchend(event: TouchEvent) {
    if (this.holding) {
      this.onRelease.emit(event);
    }

    this.holding = false;
    clearTimeout(this.timeout);
  }

  // disable right click

  @HostListener("contextmenu")
  contextmenu() {
    if (isTouchDevice) {
      return false;
    }
  }

  // In non-touch device, use mousemove and mouseleave

  @HostListener("mousemove", ["$event"])
  mousemove(event: MouseEvent) {
    if (isTouchDevice) return;
    this.onHold.emit(event);
  }

  @HostListener("mouseleave", ["$event"])
  mouseleave(event: MouseEvent) {
    if (isTouchDevice) return;
    this.onRelease.emit(event);
  }
}
