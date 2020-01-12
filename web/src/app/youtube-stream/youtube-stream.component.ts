import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { isSameDay, parseISO } from "date-fns";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import * as vtubers from "vtubers";

import { Stream } from "../models";
import { ApiService } from "../services";

@Component({
  selector: "hs-youtube-stream",
  templateUrl: "./youtube-stream.component.html",
  styleUrls: ["./youtube-stream.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class YoutubeStreamComponent implements OnInit {
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  onAir: Stream[] = [];
  ended: { day: Date; streams: Stream[] }[] = [];
  updatedAt = "";
  showSpinner = false;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  get lastId(): string {
    return this.ended[this.ended.length - 1].streams[
      this.ended[this.ended.length - 1].streams.length - 1
    ].id;
  }

  obs = new IntersectionObserver(entries => {
    if (entries.map(e => e.isIntersecting).some(e => e)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.apiService
        .getStreamsWithSkip(this.lastId)
        .subscribe(data => this.addStreams(data.streams));
    }
  });

  ngOnInit() {
    this.addStreams(this.route.snapshot.data.data.streams);
    this.updatedAt = this.route.snapshot.data.data.updatedAt;
  }

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const member of item.members) {
        if (member.id == id) return member;
      }
    }
  }

  trackBy(_: number, stream: Stream): string {
    return stream.id;
  }

  addStreams(streams: Stream[]) {
    for (let stream of streams) {
      let start = parseISO(stream.start);
      if (
        this.ended.length > 0 &&
        isSameDay(this.ended[this.ended.length - 1].day, start)
      ) {
        this.ended[this.ended.length - 1].streams.push(stream);
      } else {
        this.ended.push({ day: start, streams: [stream] });
      }
    }

    if (streams.length < 24) {
      this.showSpinner = false;
    } else {
      this.showSpinner = true;
      this.obs.observe(this.spinnerContainer.nativeElement);
    }
  }
}
