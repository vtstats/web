import { DatePipe, NgIf } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  GetNextPageParamFunction,
  InfiniteData,
  QueryFunction,
} from "@tanstack/query-core";
import { startOfHour, subHours } from "date-fns";

import { SelectVtuberAlert } from "src/app/components/alert/select-vtuber-alert";
import { DateFilter } from "src/app/components/filter-group/date-filter/date-filter";
import { KeywordFilter } from "src/app/components/filter-group/keyword-filter/keyword-filter";
import { VTuberFilter } from "src/app/components/filter-group/vtuber-filter/vtuber-filter";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { StreamsList as StreamsList_ } from "src/app/components/stream-list/stream-list";
import { Stream, StreamStatus } from "src/app/models";
import { streams } from "src/app/shared/api/entrypoint";
import { VTuberService } from "src/app/shared/config/vtuber.service";
import { infiniteQuery } from "src/app/shared/qry";

type QueryKey = [
  `streams`,
  {
    status: "live|ended" | "scheduled";
    startAt?: Date;
    endAt?: Date;
    channelIds: number[];
    keyword?: string;
  }
];

@Component({
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    StreamsList_,
    DateFilter,
    VTuberFilter,
    SelectVtuberAlert,
    RefreshButton,
    KeywordFilter,
  ],
  selector: "vts-streams-list",
  templateUrl: "streams-list.html",
})
export default class StreamsList {
  route = inject(ActivatedRoute);
  vtubers = inject(VTuberService);

  searchKeyword = signal("");
  selectedVtuberIds = signal(new Set<string>());
  selectedDateRange = signal<[Date, Date] | null>(null);

  channels = computed(() => {
    const selectedVtuberIds = this.selectedVtuberIds();

    return selectedVtuberIds.size > 0
      ? this.vtubers.channels.filter((c) => selectedVtuberIds.has(c.vtuberId))
      : this.vtubers.selectedChannels();
  });

  scheduledStreamQueryFn: QueryFunction<Array<Stream>, QueryKey> = async ({
    pageParam,
    queryKey: [_, opts],
  }) => {
    return streams({
      ...opts,
      startAt: subHours(startOfHour(Date.now()), 6),
      status: StreamStatus.SCHEDULED,
      ...pageParam,
    });
  };

  liveStreamQueryFn: QueryFunction<Array<Stream>, QueryKey> = async ({
    pageParam,
    queryKey: [_, opts],
  }) => {
    const status = pageParam?.status || StreamStatus.LIVE;
    const items = await streams({ ...opts, ...pageParam, status });

    if (items.length === 0 && status === StreamStatus.LIVE) {
      return streams({ ...opts, status: StreamStatus.ENDED });
    }

    return items;
  };

  select = (data: InfiniteData<Stream[]>) => {
    const items = data.pages.flat();
    const updatedAt = Math.max(...items.map((s) => s.updatedAt));
    return { pages: [{ items, updatedAt }], pageParams: [] };
  };

  getScheduledStreamNextPageParam: GetNextPageParamFunction<Stream[]> = (
    lastPage
  ) => {
    if (lastPage.length >= 24) {
      return { startAt: lastPage[lastPage.length - 1].scheduleTime };
    }

    return undefined;
  };

  getLiveStreamNextPageParam: GetNextPageParamFunction<Stream[]> = (
    lastPage
  ) => {
    if (lastPage.length >= 24) {
      const last = lastPage[lastPage.length - 1];
      return { status: last.status, endAt: last.startTime };
    }

    if (lastPage.length > 0 && lastPage[0].status === StreamStatus.LIVE) {
      return { status: StreamStatus.ENDED };
    }

    return undefined;
  };

  result = infiniteQuery<
    Array<Stream>,
    unknown,
    { items: Stream[]; updatedAt: number },
    Array<Stream>,
    QueryKey
  >(() => {
    const data = this.route.snapshot.data;
    const channelIds = this.channels().map((c) => c.channelId);
    const range = this.selectedDateRange();
    const keyword = this.searchKeyword();

    return {
      queryKey: [
        "streams",
        {
          status: data.status,
          channelIds,
          startAt: range?.[0],
          endAt: range?.[1],
          keyword,
        },
      ],
      enabled: channelIds.length > 0,
      select: this.select,
      queryFn:
        data.status === "scheduled"
          ? this.scheduledStreamQueryFn
          : this.liveStreamQueryFn,
      getNextPageParam:
        data.status === "scheduled"
          ? this.getScheduledStreamNextPageParam
          : this.getLiveStreamNextPageParam,
    };
  });
}
