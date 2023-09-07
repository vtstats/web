import { DatePipe, NgIf } from "@angular/common";
import { Component, Signal, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  GetNextPageParamFunction,
  InfiniteData,
  InfiniteQueryObserverOptions,
  QueryFunction,
} from "@tanstack/query-core";
import { startOfHour, subHours } from "date-fns";

import { SelectVtuberAlert } from "src/app/components/alert/select-vtuber-alert";
import { DateFilter } from "src/app/components/filter-group/date-filter/date-filter";
import { VTuberFilter } from "src/app/components/filter-group/vtuber-filter/vtuber-filter";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { StreamsList as StreamsList_ } from "src/app/components/stream-list/stream-list";
import { Stream, StreamStatus } from "src/app/models";
import { streams } from "src/app/shared/api/entrypoint";
import { VTuberService } from "src/app/shared/config/vtuber.service";
import { QryService } from "src/app/shared/qry";
import { infiniteQuery } from "src/app/shared/qry/qry.signal";

import { KeywordInput } from "./keyword-input";

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
    KeywordInput,
  ],
  selector: "hls-streams-list",
  templateUrl: "streams-list.html",
})
export default class StreamsList {
  route = inject(ActivatedRoute);
  qry = inject(QryService);
  vtubers = inject(VTuberService);

  searchKeyword = signal("");
  selectedVtuberIds = signal(new Set<string>());
  selectedDateRange = signal<[Date, Date] | null>(null);

  channels = computed(() => {
    const selectedVtuberIds = this.selectedVtuberIds();

    return selectedVtuberIds.size > 0
      ? this.vtubers.channels().filter((c) => selectedVtuberIds.has(c.vtuberId))
      : this.vtubers.selectedChannels();
  });

  queryKey = computed<QueryKey>(() => {
    const data = this.route.snapshot.data;
    const channelIds = this.channels().map((c) => c.channelId);
    const range = this.selectedDateRange();
    const keyword = this.searchKeyword();

    if (range) {
      return [
        "streams",
        {
          status: data.status,
          channelIds,
          startAt: range[0],
          endAt: range[1],
          keyword,
        },
      ];
    }

    return ["streams", { status: data.status, channelIds, keyword }];
  });

  queryFn: QueryFunction<Array<Stream>, QueryKey> = async ({
    pageParam,
    queryKey: [_, opts],
  }) => {
    if (opts.status === "scheduled") {
      return streams({
        startAt: subHours(startOfHour(Date.now()), 6),
        status: StreamStatus.SCHEDULED,
        ...opts,
        ...pageParam,
      });
    } else if (!pageParam) {
      const live = await streams({ ...opts, status: StreamStatus.LIVE });
      const ended = await streams({ ...opts, status: StreamStatus.ENDED });
      return [...live, ...ended];
    } else {
      return streams({ ...opts, ...pageParam, status: StreamStatus.ENDED });
    }
  };

  select = (data: InfiniteData<Stream[]>) => {
    const items = data.pages.flat();
    const updatedAt = Math.max(...items.map((s) => s.updatedAt));
    return { pages: [{ items, updatedAt }], pageParams: [] };
  };

  getNextPageParam: GetNextPageParamFunction<Stream[]> = (lastPage) => {
    if (lastPage.length < 24) return undefined;

    const last = lastPage[lastPage.length - 1];

    switch (last.status) {
      case StreamStatus.SCHEDULED: {
        return { startAt: last.scheduleTime };
      }
      case StreamStatus.LIVE:
      case StreamStatus.ENDED: {
        return { endAt: last.startTime };
      }
    }
  };

  options: Signal<
    InfiniteQueryObserverOptions<
      Array<Stream>,
      unknown,
      { items: Stream[]; updatedAt: number },
      Array<Stream>,
      QueryKey
    >
  > = computed(() => {
    const queryKey = this.queryKey();

    return {
      queryKey,
      enabled: queryKey[1].channelIds.length > 0,
      queryFn: this.queryFn,
      select: this.select,
      getNextPageParam: this.getNextPageParam,
    };
  });

  result = infiniteQuery(this.qry.client, this.options);
}
