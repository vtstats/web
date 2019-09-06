import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Directive({ selector: "[lazyLoad]" })
export class LazyLoadDirective implements AfterViewInit {
  @HostBinding("style.background-image") background = null;
  @Input() video: string;

  constructor(private el: ElementRef, private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    if (window && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(({ isIntersecting }) => {
          if (isIntersecting) {
            this.background = this.sanitizer.bypassSecurityTrustStyle(
              `url(https://img.youtube.com/vi/${this.video}/mqdefault.jpg)`
            );
            obs.unobserve(this.el.nativeElement);
          }
        });
      });
      obs.observe(this.el.nativeElement);
    } else {
      this.background = this.sanitizer.bypassSecurityTrustStyle(
        `url(https://img.youtube.com/vi/${this.video}/mqdefault.jpg)`
      );
    }
  }
}
