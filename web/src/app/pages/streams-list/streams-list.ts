import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute } from "@angular/router";
import { max, min } from "d3-array";
import { endOfDay, startOfDay } from "date-fns";

import { FilterGroup } from "src/app/components/filter-group/filter-group";
import { StreamsList as StreamsList_ } from "src/app/components/stream-list/stream-list";
import { Stream, StreamListResponse, StreamStatus } from "src/app/models";
import { ConfigService } from "src/app/shared";
import { listStreams } from "src/app/shared/api/entrypoint";
import { InfQry, QryService, UseQryPipe } from "src/app/shared/qry";

export type StreamsListPageData = {
  status: StreamStatus[];
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
    { items: Stream[]; updatedAt: number },
    StreamListResponse,
    QueryKey
  >;

  key: "startTime" | "scheduleTime";

  ngOnInit() {
    const data = this.route.snapshot.data;

    this.key = data.orderBy[0] === "start_time" ? "startTime" : "scheduleTime";

    this.streamsQry = this.qry.createInf({
      queryKey: this._queryKey(),
      queryFn: ({ pageParam = {}, queryKey: [_, data, ids] }) =>
        listStreams({
          ids,
          status: data.status,
          orderBy: data.orderBy.join(":") as any,
          startAt: max([pageParam.startAt, data.startAt]),
          endAt: min([pageParam.endAt, data.endAt]),
        }),
      select: ({ pages }) => {
        let items: Stream[] = [];
        let updatedAt: number;

        // group stream in same day
        for (const page of pages) {
          items.push(...page.streams);

          if (updatedAt) {
            updatedAt = Math.max(updatedAt, page.updatedAt);
          } else {
            updatedAt = page.updatedAt;
          }
        }

        return { pages: [{ items, updatedAt }], pageParams: [] };
      },
      getNextPageParam: (lastPage) => {
        // the limit is 24 by default
        const time = lastPage.streams[23]?.[this.key];

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
