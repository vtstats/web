import { DatePipe } from "@angular/common";
import { Component, input, signal } from "@angular/core";
import { injectInfiniteQuery } from "@tanstack/angular-query-experimental";

import { DateFilter } from "src/app/components/filter-group/date-filter/date-filter";
import { KeywordFilter } from "src/app/components/filter-group/keyword-filter/keyword-filter";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { StreamsList } from "src/app/components/stream-list/stream-list";
import { Channel, StreamStatus } from "src/app/models";
import { streams } from "src/app/shared/api/entrypoint";

@Component({
  standalone: true,
  imports: [StreamsList, KeywordFilter, DateFilter, DatePipe, RefreshButton],
  selector: "vts-vtuber-streams",
  templateUrl: "./vtuber-streams.html",
})
export class VtuberStreams {
  channels = input<Array<Channel>>([]);

  selectedDateRange = signal<[Date, Date] | null>(null);
  keyword = signal("");

  result = injectInfiniteQuery(() => {
    const range = this.selectedDateRange();
    const channelIds = this.channels().map((c) => c.channelId);
    const keyword = this.keyword();

    return {
      queryKey: [
        "streams",
        {
          status: StreamStatus.ENDED,
          channelIds,
          startAt: range?.[0],
          endAt: range?.[1],
          keyword,
        },
      ] as const,

      enabled: channelIds.length > 0,

      initialPageParam: {},

      queryFn: ({ pageParam, queryKey: [_, opts] }) =>
        streams({ ...opts, ...pageParam }),

      select: ({ pages }) => {
        const items = pages.flat();
        const updatedAt = Math.max(...items.map((s) => s.updatedAt));
        return { items, updatedAt };
      },

      getNextPageParam: (lastPage) => {
        const last = lastPage[23];
        if (!last) return undefined;
        return { endAt: last.startTime };
      },
    };
  });
}
