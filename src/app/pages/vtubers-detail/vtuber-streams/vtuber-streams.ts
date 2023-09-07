import { DatePipe, NgIf } from "@angular/common";
import {
  Component,
  Input,
  Signal,
  computed,
  inject,
  signal,
} from "@angular/core";
import { InfiniteQueryObserverOptions } from "@tanstack/query-core";

import { DateFilter } from "src/app/components/filter-group/date-filter/date-filter";
import { KeywordFilter } from "src/app/components/filter-group/keyword-filter/keyword-filter";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { StreamsList } from "src/app/components/stream-list/stream-list";
import { Channel, Stream, VTuber } from "src/app/models";
import { streams } from "src/app/shared/api/entrypoint";
import { QryService } from "src/app/shared/qry";
import { infiniteQuery } from "src/app/shared/qry/qry.signal";

type QueryKey = [
  "streams",
  {
    status: "ended";
    startAt?: Date;
    endAt?: Date;
    channelIds: number[];
    keyword: string;
  }
];

@Component({
  standalone: true,
  imports: [
    StreamsList,
    KeywordFilter,
    DateFilter,
    NgIf,
    DatePipe,
    RefreshButton,
  ],
  selector: "hls-vtuber-streams",
  templateUrl: "./vtuber-streams.html",
})
export class VtuberStreams {
  @Input() vtuber: VTuber;

  @Input("channels") set channels_(channels: Array<Channel>) {
    this.channels.set(channels);
  }

  channels = signal<Array<Channel>>([]);

  private qry = inject(QryService);

  selectedDateRange = signal<[Date, Date] | null>(null);
  keyword = signal("");

  queryKey = computed<QueryKey>(() => {
    const range = this.selectedDateRange();
    const channelIds = this.channels().map((c) => c.channelId);
    const keyword = this.keyword();

    if (range) {
      return [
        "streams",
        {
          status: "ended",
          channelIds,
          startAt: range[0],
          endAt: range[1],
          keyword,
        },
      ];
    }

    return ["streams", { status: "ended", channelIds, keyword }];
  });

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

      queryFn: ({ pageParam, queryKey: [_, opts] }) =>
        streams({ ...opts, ...pageParam }),

      select: ({ pages }) => {
        const items = pages.flat();
        const updatedAt = Math.max(...items.map((s) => s.updatedAt));
        return { pages: [{ items, updatedAt }], pageParams: [] };
      },

      getNextPageParam: (lastPage) => {
        const last = lastPage[23];
        if (!last) return undefined;
        return { endAt: last.startTime };
      },
    };
  });

  result = infiniteQuery(this.qry.client, this.options);
}
