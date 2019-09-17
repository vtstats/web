import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { switchMap, map } from "rxjs/operators";

import { Stream } from "@holostats/libs/models";
import { VTUBERS } from "@holostats/libs/const";

import { ApiService, ConfigService } from "../services";

@Component({
  selector: "hs-streams",
  templateUrl: "./streams.component.html",
  styleUrls: ["./streams.component.scss"]
})
export class StreamsComponent implements OnInit, OnDestroy {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {}

  vtubers = VTUBERS;
  streams: Stream[] = [];
  updatedAt = "";

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.configService.subscribeIds$
      .pipe(switchMap(ids => this.apiService.getStreams(ids)))
      .subscribe(data => {
        this.streams = data.streams;
        this.updatedAt = data.updatedAt;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  findVTuber(id: string) {
    return this.vtubers.find(v => v.id == id);
  }

  trackBy(_: number, stream: Stream): string {
    return stream.id;
  }
}
