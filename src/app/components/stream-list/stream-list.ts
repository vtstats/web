import {
  NgFor,
  NgSwitch,
  NgSwitchCase,
  isPlatformServer,
} from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  inject,
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
    NgFor,
    NgSwitch,
    NgSwitchCase,
    GroupStreamsPipe,
  ],
  selector: "vts-stream-list",
  templateUrl: "stream-list.html",
})
export class StreamsList implements OnInit, OnDestroy {
  @ViewChild("spinner", { static: true, read: ElementRef })
  spinner!: ElementRef;

  @Input() items: Stream[] | undefined = [];
  @Input() groupBy: boolean = false;
  @Input() loading: boolean = false;
  @Input() hideSpinner: boolean = false;
  @Output() reachedEnd = new EventEmitter();

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

  trackBy(_: number, item: Stream): number {
    return item.streamId;
  }

  trackByGroup(_: number, group: StreamGroup) {
    return group.name;
  }
}
