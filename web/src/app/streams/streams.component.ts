import { Component, OnInit } from "@angular/core";
import { switchMap } from "rxjs/operators";

import { ApiService, ConfigService } from "../services";

@Component({
  selector: "hs-streams",
  templateUrl: "./streams.component.html",
  styleUrls: ["./streams.component.css"]
})
export class StreamsComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.configService.subscribeIds$
      .pipe(switchMap(ids => this.apiService.getStreams(ids)))
      .subscribe(data => {
        console.log(data);
      });
  }
}
