import { isPlatformServer } from "@angular/common";
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  booleanAttribute,
  inject,
  input,
  output,
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { Stream } from "src/app/models";

import { GroupStreamsPipe } from "./group-stream.pipe";
import { StreamItem } from "./stream-item/stream-item";
import { StreamItemShimmer } from "./stream-item/stream-item-shimmer";

@Component({
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    StreamItem,
    StreamItemShimmer,
    GroupStreamsPipe,
  ],
  selector: "vts-stream-list",
  templateUrl: "stream-list.html",
})
export class StreamsList implements OnInit, OnDestroy {
  @ViewChild("spinner", { static: true, read: ElementRef })
  spinner!: ElementRef;

  items = input<Stream[] | undefined>([]);
  hideSpinner = input(false);
  groupBy = input(false, { transform: booleanAttribute });
  reachedEnd = output();

  obs?: IntersectionObserver;
  platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // node.js doesn't have intersection observer
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.reachedEnd.emit();
      }
    });
    this.obs.observe(this.spinner.nativeElement);
  }

  ngOnDestroy() {
    if (this.obs) {
      this.obs.unobserve(this.spinner.nativeElement);
    }
  }
}
