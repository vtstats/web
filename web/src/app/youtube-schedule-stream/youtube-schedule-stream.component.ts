import { Component, OnInit } from "@angular/core";
import { isSameDay, parseISO } from "date-fns";

import { Stream } from "src/app/models";
import { ApiService } from "src/app/services";
import { TickService } from "../shared/tick.service";

@Component({
  selector: "hs-youtube-schedule-stream",
  templateUrl: "./youtube-schedule-stream.component.html",
})
export class YoutubeScheduleStreamComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private tickService: TickService
  ) {}

  everyMinute$ = this.tickService.everyMinute$;

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
