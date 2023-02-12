import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { Stream } from "src/app/models";

import { GroupStreamsPipe, StreamGroup } from "./group-stream.pipe";
import { StreamItem } from "./stream-item/stream-item";
import { StreamItemShimmer } from "./stream-item/stream-item-shimmer";

@Component({
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    StreamItem,
    StreamItemShimmer,
    CommonModule,
    GroupStreamsPipe,
  ],
  selector: "hls-stream-list",
  templateUrl: "stream-list.html",
})
export class StreamsList {
  @ViewChild("spinner", { static: true, read: ElementRef }) spinner: ElementRef;

  @Input() items: Stream[];
  @Input() groupBy: "startTime" | "scheduleTime";
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

  trackBy(_: number, item: Stream): string {
    return item.streamId;
  }

  trackByGroup(_: number, group: StreamGroup) {
    return group.name;
  }
}
