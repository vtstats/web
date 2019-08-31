import { Component, OnInit } from "@angular/core";
import { switchMap } from "rxjs/operators";
import { formatDistanceToNow, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

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
}
