import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { parseISO, isSameDay } from "date-fns";

import { Stream, StreamListResponse } from "src/app/models";
import { ApiService, ConfigService } from "src/app/shared";

@Component({
  selector: "hs-youtube-stream",
  templateUrl: "./youtube-stream.component.html",
})
export class YoutubeStreamComponent implements OnInit {
  constructor(
    private api: ApiService,
    private title: Title,
    private config: ConfigService
  ) {}

  streamGroup: { day: Date; streams: Stream[] }[] = [];
  lastStreamStart: Date;

  loading = true;
  updatedAt = "";
  showSpinner = false;

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  obs = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.api
        .getYouTubeStreams([...this.config.selectedVTubers], {
          endAt: this.lastStreamStart,
        })
        .subscribe((res) => this.addStreams(res));
    }
  });

  ngOnInit() {
    this.title.setTitle(`${$localize`:@@youtubeStream:`} | HoloStats`);

    this.loading = true;
    this.api
      .getYouTubeStreams([...this.config.selectedVTubers], {
        endAt: new Date(),
      })
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
