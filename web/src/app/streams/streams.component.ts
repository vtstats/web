import { Component, OnInit } from "@angular/core";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import { Stream } from "@holostats/libs/models";
import { VTUBERS } from "@holostats/libs/const";

import { ApiService, Config } from "../services";

@Component({
  selector: "hs-streams",
  templateUrl: "./streams.component.html",
  styleUrls: ["./streams.component.scss"]
})
export class StreamsComponent implements OnInit {
  constructor(private apiService: ApiService, private config: Config) {}

  vtubers = VTUBERS;
  streams: Stream[] = [];
  updatedAt = "";

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  ngOnInit() {
    this.apiService.getStreams(this.config.selectedVTubers).subscribe(data => {
      this.streams = data.streams;
      this.updatedAt = data.updatedAt;
    });
  }

  findVTuber(id: string) {
    return this.vtubers.find(v => v.id == id);
  }

  trackBy(_: number, stream: Stream): string {
    return stream.id;
  }
}
