import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";

import type { VTuber } from "src/app/models";
import { ApiService } from "src/app/shared";

@Component({
  selector: "hls-stream-time",
  templateUrl: "stream-time.html",
  styleUrls: ["stream-time.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamTime implements OnInit {
  @Input() vtuber: VTuber;

  loading: boolean;
  times: [number, number][] = [];

  precision: "hour" | "day" | "weekday" | "month" = "day";

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loading = true;

    this.api.streamTimes(this.vtuber.id).subscribe((res) => {
      this.loading = false;
      this.times = res.times;
    });
  }
}
