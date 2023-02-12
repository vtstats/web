import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import qs from "query-string";

import { Menu } from "src/app/components/menu/menu";
import { StreamTimesResponse } from "src/app/models";
import { VTuber } from "src/app/shared/config/vtuber.service";
import { FormatDurationPipe } from "src/app/shared/pipes/format-duration.pipe";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { StreamTimeBarChart } from "./stream-time-bar-chart/stream-time-bar-chart";
import { StreamTimeCalendar } from "./stream-time-calendar/stream-time-calendar";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    StreamTimeBarChart,
    StreamTimeCalendar,
    UseQryPipe,
    FormatDurationPipe,
    Menu,
  ],
  selector: "hls-stream-time",
  templateUrl: "stream-time.html",
})
export class StreamTime implements OnInit {
  private qry = inject(QryService);

  @Input() vtuber: VTuber;

  precision: "hour" | "day" | "weekday" | "month" = "day";

  streamTimesQry: Qry<
    StreamTimesResponse,
    unknown,
    [number, number][],
    StreamTimesResponse,
    ["streamTimes", string]
  >;

  ngOnInit() {
    this.streamTimesQry = this.qry.create({
      queryKey: ["streamTimes", this.vtuber.id],
      queryFn: ({ queryKey: [_, id] }) =>
        fetch(
          qs.stringifyUrl(
            {
              url: "https://holoapi.poi.cat/api/v4/stream_times",
              query: {
                id,
              },
            },
            { arrayFormat: "comma" }
          )
        ).then((res) => res.json()),
      select: (res) => res.times,
    });
  }

  getTotal(times: [number, number][]): number {
    if (!times) return 0;
    return times.reduce((acc, cur) => acc + cur[1], 0);
  }
}
