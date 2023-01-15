import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import qs from "query-string";

import { StreamTimesResponse, VTuber } from "src/app/models";
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
}
