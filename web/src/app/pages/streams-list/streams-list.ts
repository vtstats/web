import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute } from "@angular/router";
import { max, min } from "d3-array";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
import qs from "query-string";

import { FilterGroup } from "src/app/components/filter-group/filter-group";
import {
  StreamListDataSource,
  StreamsList as StreamsList_,
} from "src/app/components/stream-list/stream-list";
import { StreamListResponse } from "src/app/models";
import { ConfigService } from "src/app/shared";
import { InfQry, QryService, UseQryPipe } from "src/app/shared/qry";

export type StreamsListPageData = {
  status: string[];
  orderBy: [string, string];
  startAt?: number;
  endAt?: number;
};

type QueryKey = ["youtube_streams", StreamsListPageData, string[]];

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FilterGroup,
    UseQryPipe,
    StreamsList_,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  selector: "hls-streams-list",
  templateUrl: "streams-list.html",
})
export class StreamsList implements OnInit {
  private qry = inject(QryService);
  private route = inject(ActivatedRoute);
  private config = inject(ConfigService);

  streamsQry: InfQry<
    StreamListResponse,
    unknown,
    { dataSource: StreamListDataSource; updatedAt: number },
    StreamListResponse,
    QueryKey
  >;

  ngOnInit() {
    const data = this.route.snapshot.data;

    const key = data.orderBy[0] === "start_time" ? "startTime" : "scheduleTime";

    this.streamsQry = this.qry.createInf({
      queryKey: this._queryKey(),
      queryFn: ({ pageParam = {}, queryKey: [_, data, ids] }) =>
        fetch(
          qs.stringifyUrl(
            {
              url: "https://holoapi.poi.cat/api/v4/youtube_streams",
              query: {
                ids,
                status: data.status,
                orderBy: data.orderBy.join(":"),
                startAt: max([pageParam.startAt, data.startAt]),
                endAt: min([pageParam.endAt, data.endAt]),
              },
            },
            {
              arrayFormat: "comma",
            }
          )
        ).then((res) => res.json()),
      select: ({ pages }) => {
        const groups = [];

        let last: number | undefined;
        let updatedAt: number;

        // group stream in same day
        for (const page of pages) {
          for (const stream of page.streams) {
            if (last && isSameDay(last, stream[key])) {
              groups[groups.length - 1].streams.push(stream);
            } else {
              groups.push({ name: stream[key], streams: [stream] });
            }

            last = stream[key];
          }

          if (updatedAt) {
            updatedAt = Math.max(updatedAt, page.updatedAt);
          } else {
            updatedAt = page.updatedAt;
          }
        }

        return {
          pages: [{ dataSource: { groups }, updatedAt }],
          pageParams: [],
        };
      },
      getNextPageParam: (lastPage) => {
        // the limit is 24 by default
        const time = lastPage.streams[23]?.[key];

        if (!time) return undefined;

        if (data.orderBy[1] === "asc") {
          return { startAt: time };
        } else {
          return { endAt: time };
        }
      },
    });
  }

  onDateRangeChange(range: [Date, Date]) {
    this.streamsQry.updateQueryKey(
      this._queryKey(Number(startOfDay(range[0])), Number(endOfDay(range[1])))
    );
  }

  onVTuberChange(ids: Set<string>) {
    this.streamsQry.updateQueryKey(
      this._queryKey(undefined, undefined, [...ids])
    );
  }

  onClear() {
    this.streamsQry.updateQueryKey(this._queryKey());
  }

  private _queryKey(
    startAt?: number,
    endAt?: number,
    ids?: string[]
  ): QueryKey {
    const data = this.route.snapshot.data;

    if (startAt) data.startAt = startAt;
    if (endAt) data.endAt = endAt;

    return ["youtube_streams", data as any, ids || [...this.config.vtuber]];
  }
}
