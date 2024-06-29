import { Component, Input, inject } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { ActivatedRoute } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";

import { Menu } from "src/app/components/menu/menu";
import { VTuber } from "src/app/models";
import { streamsTimes } from "src/app/shared/api/entrypoint";
import { FormatDurationPipe } from "src/app/shared/pipes/format-duration.pipe";
import { CATALOG_CHANNELS } from "src/app/shared/tokens";
import { StreamTimeBarChart } from "./stream-time-bar-chart/stream-time-bar-chart";
import { StreamTimeCalendar } from "./stream-time-calendar/stream-time-calendar";

@Component({
  standalone: true,
  imports: [
    MatDividerModule,
    StreamTimeBarChart,
    StreamTimeCalendar,
    FormatDurationPipe,
    Menu,
  ],
  selector: "vts-stream-time",
  templateUrl: "stream-time.html",
})
export class StreamTime {
  private channels = inject(CATALOG_CHANNELS);
  private route = inject(ActivatedRoute);

  @Input({ required: true }) vtuber!: VTuber;

  precision: "hour" | "day" | "weekday" | "month" = "day";

  readonly precisionOptions: Array<{
    value: "hour" | "day" | "weekday" | "month";
    label: string;
  }> = [
    { value: "hour", label: "Hour" },
    { value: "day", label: "Day" },
    { value: "weekday", label: "Weekday" },
    { value: "month", label: "Month" },
  ];

  query = injectQuery(() => {
    const vtuberId = this.route.snapshot.params.vtuberId;

    const channelIds = this.channels
      .filter((c) => c.vtuberId === vtuberId)
      .map((c) => c.channelId);

    return {
      queryKey: ["stream-times", { channelIds }] as const,
      queryFn: ({ queryKey: [_, { channelIds }] }) => streamsTimes(channelIds),
    };
  });

  getTotal(times?: [number, number][]): number {
    if (!times) return 0;
    return times.reduce((acc, cur) => acc + cur[1], 0);
  }
}
