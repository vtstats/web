import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "hls-loading-spinner",
  templateUrl: "loading-spinner.html",
  styleUrls: ["loading-spinner.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinner {
  @ViewChild("spinner", { static: true, read: ElementRef }) spinner: ElementRef;

  @Output() reach = new EventEmitter();

  @Input() hidden: boolean;

  obs = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      this.reach.emit();
    }
  });

  ngOnInit() {
    this.obs.observe(this.spinner.nativeElement);
  }

  ngOnDestroy() {
    this.obs.unobserve(this.spinner.nativeElement);
  }
}
