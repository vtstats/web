import { Component, OnInit } from "@angular/core";
import { switchMap, map } from "rxjs/operators";
import { timer } from "rxjs";

import { Stream } from "@holostats/libs/models";
import { VTUBERS } from "@holostats/libs/const";

import { ApiService, ConfigService } from "../services";

@Component({
  selector: "hs-streams",
  templateUrl: "./streams.component.html",
  styleUrls: ["./streams.component.scss"]
})
export class StreamsComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {}

  vtubers = VTUBERS;
  streams: Stream[] = [];
  updatedAt = "";

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  ngOnInit() {
    this.configService.subscribeIds$
      .pipe(switchMap(ids => this.apiService.getStreams(ids)))
      .subscribe(data => {
        this.streams = data.streams;
        this.updatedAt = data.updatedAt;
      });
  }

  findVTuber(id: string) {
    return this.vtubers.find(v => v.id == id);
  }

  trackBy(_, stream: Stream): string {
    return stream.id;
  }
}
