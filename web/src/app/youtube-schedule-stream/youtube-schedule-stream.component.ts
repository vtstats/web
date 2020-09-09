import { Component, OnInit } from "@angular/core";
import { isSameDay, parseISO } from "date-fns";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import { Stream } from "src/app/models";
import { ApiService } from "src/app/services";

@Component({
  selector: "hs-youtube-schedule-stream",
  templateUrl: "./youtube-schedule-stream.component.html",
})
export class YoutubeScheduleStreamComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  loading = false;
  streamGroup: Array<{ day: Date; streams: Array<Stream> }> = [];
  updatedAt = "";

  ngOnInit() {
    this.loading = true;
    this.apiService.getYouTubeScheduleStream().subscribe((res) => {
      this.loading = false;
      this.updatedAt = res.updatedAt;

      let lastStreamSchedule: Date;

      for (const stream of res.streams) {
        const schedule = parseISO(stream.scheduleTime);
        if (lastStreamSchedule && isSameDay(lastStreamSchedule, schedule)) {
          this.streamGroup[this.streamGroup.length - 1].streams.push(stream);
        } else {
          this.streamGroup.push({ day: schedule, streams: [stream] });
        }
        lastStreamSchedule = schedule;
      }
    });
  }

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
  }
}
