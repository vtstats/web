import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  format,
  fromUnixTime,
  differenceInMinutes,
  startOfMinute,
  getUnixTime,
  subMinutes
} from "date-fns";
import { switchMap } from "rxjs/operators";
import { Stream } from "@holostats/libs/models";

import { ApiService } from "../services";

@Component({
  selector: "hs-streams-detail",
  templateUrl: "./streams-detail.component.html",
  styleUrls: ["./streams-detail.component.scss"]
})
export class StreamsDetailComponent implements OnInit {
  constructor(private service: ApiService, private route: ActivatedRoute) {}

  view = [600, 200];

  stream: Stream;
  stats = [];

  youtubeColorScheme = { domain: ["#e00404"] };

  xAxisTicks = [];

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap(params => this.service.getStreamStat(params.get("id"))))
      .subscribe(res => {
        const series = Object.entries(res.stats).map(([name, value]) => ({
          value,
          name: parseInt(name)
        }));
        const step = Math.ceil(
          differenceInMinutes(
            fromUnixTime(series[series.length - 1].name),
            fromUnixTime(series[0].name)
          ) / 6
        );
        const end = startOfMinute(series[series.length - 1].name);
        this.xAxisTicks = [
          getUnixTime(subMinutes(end, 4 * step)),
          getUnixTime(subMinutes(end, 3 * step)),
          getUnixTime(subMinutes(end, 2 * step)),
          getUnixTime(subMinutes(end, 1 * step)),
          getUnixTime(end)
        ];
        console.log(this.xAxisTicks);
        this.stream = res;
        this.stats.push({ name: "viewerStats", series });
      });
  }

  dateTickFormatting(val: number): string {
    return format(fromUnixTime(val), "MM/dd");
  }
}
