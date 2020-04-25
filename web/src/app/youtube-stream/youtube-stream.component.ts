import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { timer } from "rxjs";
import { map } from "rxjs/operators";
import dayjs, { Dayjs } from "dayjs";

import { Stream, StreamListResponse } from "src/app/models";
import { ApiService } from "src/app/services";

@Component({
  selector: "hs-youtube-stream",
  templateUrl: "./youtube-stream.component.html",
  styleUrls: ["./youtube-stream.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class YoutubeStreamComponent implements OnInit {
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  streamGroup: { day: Dayjs; streams: Stream[] }[] = [];
  lastStreamStart: Dayjs;

  updatedAt = "";
  showSpinner = false;

  everySecond$ = timer(0, 1000).pipe(map(() => dayjs()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => dayjs()));

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  obs = new IntersectionObserver((entries) => {
    if (entries.map((e) => e.isIntersecting).some((e) => e)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.apiService
        .getYouTubeStreams(dayjs(0), this.lastStreamStart)
        .subscribe((res) => this.addStreams(res));
    }
  });

  ngOnInit() {
    const res: StreamListResponse = this.route.snapshot.data.data;
    this.addStreams(res);
  }

  addStreams(res: StreamListResponse) {
    this.updatedAt = res.updatedAt;

    for (const stream of res.streams) {
      const start = dayjs(stream.startTime);
      if (this.lastStreamStart && this.lastStreamStart.isSame(start, "day")) {
        this.streamGroup[this.streamGroup.length - 1].streams.push(stream);
      } else {
        this.streamGroup.push({ day: start, streams: [stream] });
      }
      this.lastStreamStart = dayjs(start);
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
