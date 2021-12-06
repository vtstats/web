import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { createPopper, Instance, Options } from "@popperjs/core";

@Component({
  selector: "hs-popper",
  templateUrl: "popper.html",
  styleUrls: ["./popper.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopperComponent implements OnChanges, OnDestroy {
  @ViewChild("popper", { static: true })
  popper: ElementRef;

  @Input() arrow: boolean = true;
  @Input() reference: HTMLElement;
  @Input() options: Partial<Options> = {};

  instance: Instance;

  constructor(private ngZone: NgZone) {}

  ngOnChanges() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }

    if (this.reference) {
      this.instance = this.ngZone.runOutsideAngular(() =>
        createPopper(this.reference, this.popper.nativeElement, this.options)
      );
    }
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }

  public update() {
    this.instance?.update();
  }
}
