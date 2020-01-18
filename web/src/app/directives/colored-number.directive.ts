import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({ selector: "[coloredNumber]" })
export class ColoredNumberDirective implements OnChanges {
  @Input("coloredNumber") inputNumber: number;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    if (this.inputNumber > 0) {
      this.el.nativeElement.classList.add("positive");
    } else if (this.inputNumber < 0) {
      this.el.nativeElement.classList.add("negative");
    }
  }
}
