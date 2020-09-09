import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { parseISO, isSameDay } from "date-fns";

import { Stream, StreamListResponse } from "src/app/models";
import { ApiService } from "src/app/services";
import { TickService } from "../shared/tick.service";

@Component({
  selector: "hs-youtube-stream",
  templateUrl: "./youtube-stream.component.html",
})
export class YoutubeStreamComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private tickService: TickService
  ) {}

  streamGroup: { day: Date; streams: Stream[] }[] = [];
  lastStreamStart: Date;

  loading = true;
  updatedAt = "";
  showSpinner = false;

  everySecond$ = this.tickService.everySecond$;
  everyMinute$ = this.tickService.everyMinute$;

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  // FIXME
  obs = new IntersectionObserver((entries) => {
    if (entries.map((e) => e.isIntersecting).some((e) => e)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.apiService
        .getYouTubeStreams(new Date(0), this.lastStreamStart)
        .subscribe((res) => this.addStreams(res));
    }
  });

  ngOnInit() {
    this.loading = true;
    this.apiService
      .getYouTubeStreams(new Date(0), new Date())
      .subscribe((res) => {
        this.loading = false;
        this.addStreams(res);
      });
  }

  addStreams(res: StreamListResponse) {
    this.updatedAt = res.updatedAt;

    for (const stream of res.streams) {
      const start = parseISO(stream.startTime);
      if (this.lastStreamStart && isSameDay(this.lastStreamStart, start)) {
        this.streamGroup[this.streamGroup.length - 1].streams.push(stream);
      } else {
        this.streamGroup.push({ day: start, streams: [stream] });
      }
      this.lastStreamStart = start;
    }

    if (res.streams.length == 24) {
      this.showSpinner = true;
      this.obs.observe(this.spinnerContainer.nativeElement);
    } else {
      this.showSpinner = false;
    }
  }

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
  }
}
