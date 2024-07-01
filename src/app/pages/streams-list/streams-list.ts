import { DatePipe } from "@angular/common";
import {
  AfterRenderPhase,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { injectInfiniteQuery } from "@tanstack/angular-query-experimental";
import { InfiniteData } from "@tanstack/query-core";
import { startOfDay, startOfHour, subDays, subHours } from "date-fns";

import { SelectVtuberAlert } from "src/app/components/alert/select-vtuber-alert";
import { DateFilter } from "src/app/components/filter-group/date-filter/date-filter";
import { KeywordFilter } from "src/app/components/filter-group/keyword-filter/keyword-filter";
import { VTuberFilter } from "src/app/components/filter-group/vtuber-filter/vtuber-filter";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { StreamsList as StreamsList_ } from "src/app/components/stream-list/stream-list";
import { StreamLoadingList } from "src/app/components/stream-list/stream-loading-list";
import { Stream, StreamStatus } from "src/app/models";
import { streams } from "src/app/shared/api/entrypoint";
import { VTuberService } from "src/app/shared/config/vtuber.service";

type QueryKey = [
  `streams`,
  {
    status: "live|ended" | "scheduled";
    startAt?: Date;
    endAt?: Date;
    channelIds: number[];
    keyword?: string;
  },
];

type PageParam = { status?: StreamStatus; startAt?: number; endAt?: number };

type Data = { items: Stream[]; updatedAt?: number };

@Component({
  standalone: true,
  imports: [
    DatePipe,
    StreamsList_,
    StreamLoadingList,
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

  channelIds = computed(() => {
    const selectedVtuberIds = this.selectedVtuberIds();

    return selectedVtuberIds.size > 0
      ? this.vtubers.channels
          .filter((c) => selectedVtuberIds.has(c.vtuberId))
          .map((c) => c.channelId)
      : this.vtubers.selectedChannels().map((c) => c.channelId);
  });

  select = (data: InfiniteData<Stream[]>) => {
    const items = data.pages.flat();
    const updatedAt = Math.max(...items.map((s) => s.updatedAt));
    return { items, updatedAt };
  };

  result = injectInfiniteQuery<Stream[], Error, Data, QueryKey, PageParam>(
    () => {
      const data = this.route.snapshot.data;
      const channelIds = this.channelIds();

      if (data.status === "scheduled") {
        return {
          queryKey: ["streams", { status: data.status, channelIds }],
          enabled: this.csr() && channelIds.length > 0,
          select: this.select,
          initialPageParam: {},
          queryFn: ({ pageParam, queryKey: [_, opts] }) => {
            return streams({
              channelIds: opts.channelIds,
              startAt: subHours(startOfHour(Date.now()), 6),
              status: StreamStatus.SCHEDULED,
              ...pageParam,
            });
          },
          getNextPageParam: (lastPage) => {
            if (lastPage.length >= 24) {
              return { startAt: lastPage[lastPage.length - 1].scheduleTime };
            }
            return undefined;
          },
        };
      }

      const range = this.selectedDateRange();
      const keyword = this.searchKeyword();

      return {
        queryKey: [
          "streams",
          {
            status: data.status,
            channelIds,
            startAt: range ? range[0] : subDays(startOfDay(new Date()), 30),
            endAt: range?.[1],
            keyword,
          },
        ],
        enabled: this.csr() && channelIds.length > 0,
        select: this.select,
        initialPageParam: {
          status: StreamStatus.LIVE,
        },
        queryFn: ({ pageParam, queryKey: [_, opts] }) => {
          return streams({
            ...opts,
            ...pageParam,
            status: pageParam.status || StreamStatus.LIVE,
          });
        },
        getNextPageParam: (lastPage, _, lastPageParam) => {
          if (lastPage.length >= 24) {
            const last = lastPage[lastPage.length - 1];
            return { status: last.status, endAt: last.startTime };
          }
          if (lastPageParam.status === StreamStatus.LIVE) {
            return { status: StreamStatus.ENDED };
          }
          return undefined;
        },
      };
    },
  );

  csr = signal(false);

  constructor() {
    afterNextRender(() => this.csr.set(true), {
      phase: AfterRenderPhase.Write,
    });
  }
}
