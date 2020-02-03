import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { isSameDay, parseISO } from "date-fns";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import * as vtubers from "vtubers";

import { Stream, StreamListResponse } from "../models";

@Component({
  selector: "hs-youtube-schedule-stream",
  templateUrl: "./youtube-schedule-stream.component.html",
  styleUrls: ["./youtube-schedule-stream.component.scss"]
})
export class YoutubeScheduleStreamComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  streamGroup: { day: Date; streams: Stream[] }[] = [];

  ngOnInit() {
    const res: StreamListResponse = this.route.snapshot.data.data;

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
}
