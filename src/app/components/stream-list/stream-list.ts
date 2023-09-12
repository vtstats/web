import { NgFor, NgSwitch, NgSwitchCase } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { Stream } from "src/app/models";

import { GroupStreamsPipe, StreamGroup } from "./group-stream.pipe";
import { StreamItem } from "./stream-item/stream-item";
import { StreamItemShimmer } from "./stream-item/stream-item-shimmer";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    StreamItem,
    StreamItemShimmer,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    GroupStreamsPipe,
  ],
  selector: "vts-stream-list",
  templateUrl: "stream-list.html",
})
export class StreamsList {
  private sanitizer = inject(DomSanitizer);

  @ViewChild("spinner", { static: true, read: ElementRef }) spinner: ElementRef;

  @Input() items: Stream[];
  @Input() groupBy: boolean;
  @Input() loading: boolean;
  @Input() hideSpinner: boolean;
  @Output() reachedEnd = new EventEmitter();

  obs = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      this.reachedEnd.emit();
    }
  });

  ngOnInit() {
    this.obs.observe(this.spinner.nativeElement);
  }

  ngOnDestroy() {
    this.obs.unobserve(this.spinner.nativeElement);
  }

  trackBy(_: number, item: Stream): number {
    return item.streamId;
  }

  trackByGroup(_: number, group: StreamGroup) {
    return group.name;
  }
}
