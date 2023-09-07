import { NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

import { Menu } from "src/app/components/menu/menu";
import { FormatDurationPipe } from "src/app/shared/pipes/format-duration.pipe";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { VTuber } from "src/app/models";
import { streamsTimes } from "src/app/shared/api/entrypoint";
import { VTuberService } from "src/app/shared/config/vtuber.service";
import { StreamTimeBarChart } from "./stream-time-bar-chart/stream-time-bar-chart";
import { StreamTimeCalendar } from "./stream-time-calendar/stream-time-calendar";

@Component({
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgIf,
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
  private vtuberService = inject(VTuberService);

  @Input() vtuber: VTuber;

  precision: "hour" | "day" | "weekday" | "month" = "day";

  precisionOptions: Array<{
    value: "hour" | "day" | "weekday" | "month";
    label: string;
  }> = [
    { value: "hour", label: "Hour" },
    { value: "day", label: "Day" },
    { value: "weekday", label: "Weekday" },
    { value: "month", label: "Month" },
  ];

  streamTimesQry: Qry<
    Array<[number, number]>,
    unknown,
    Array<[number, number]>,
    Array<[number, number]>,
    ["stream-times", { channelIds: number[] }]
  >;

  ngOnInit() {
    const channelIds = this.vtuberService
      .channels()
      .filter((c) => c.vtuberId === this.vtuber.vtuberId)
      .map((c) => c.channelId);

    this.streamTimesQry = this.qry.create({
      queryKey: ["stream-times", { channelIds }],
      queryFn: ({ queryKey: [_, { channelIds }] }) => streamsTimes(channelIds),
    });
  }

  getTotal(times: [number, number][]): number {
    if (!times) return 0;
    return times.reduce((acc, cur) => acc + cur[1], 0);
  }
}
