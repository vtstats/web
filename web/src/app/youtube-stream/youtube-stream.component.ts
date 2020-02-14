import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { isSameDay, parseISO } from "date-fns";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import * as vtubers from "vtubers";

import { StreamListResponse, Stream } from "../models";
import { ApiService } from "../services";

@Component({
  selector: "hs-youtube-stream",
  templateUrl: "./youtube-stream.component.html",
  styleUrls: ["./youtube-stream.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class YoutubeStreamComponent implements OnInit {
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  streamGroup: { day: Date; streams: Stream[] }[] = [];
  lastStreamStart: Date;

  updatedAt = "";
  showSpinner = false;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  obs = new IntersectionObserver(entries => {
    if (entries.map(e => e.isIntersecting).some(e => e)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.apiService
        .getYouTubeStreams(new Date(0), this.lastStreamStart)
        .subscribe(res => this.addStreams(res));
    }
  });

  ngOnInit() {
    const res: StreamListResponse = this.route.snapshot.data.data;
    this.addStreams(res);
  }

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const member of item.members) {
        if (member.id == id) return member;
      }
    }
  }

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
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
}
