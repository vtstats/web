import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { max, min } from "d3-array";
import { endOfDay, startOfDay } from "date-fns";
import qs from "query-string";

import { FilterGroup } from "src/app/components/filter-group/filter-group";
import {
  StreamListDataSource,
  StreamsList,
} from "src/app/components/stream-list/stream-list";
import { Stream, StreamListResponse } from "src/app/models";
import { InfQry, QryService, UseQryPipe } from "src/app/shared/qry";
import { VTuber } from "vtubers";

type QueryKey = [
  "youtube_streams",
  {
    status: string[];
    orderBy: [string, string];
    startAt?: number;
    endAt?: number;
  },
  string[]
];

@Component({
  standalone: true,
  imports: [
    StreamsList,
    FilterGroup,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    UseQryPipe,
    MatButtonModule,
  ],
  selector: "hls-vtuber-streams",
  templateUrl: "./vtuber-streams.component.html",
})
export class VtuberStreamsComponent implements OnInit {
  @Input() vtuber: VTuber;

  private qry = inject(QryService);

  streamsQry: InfQry<
    StreamListResponse,
    unknown,
    { dataSource: StreamListDataSource; updatedAt: number },
    StreamListResponse,
    QueryKey
  >;

  ngOnInit() {
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
            { arrayFormat: "comma" }
          )
        ).then((res) => res.json()),
      select: ({ pages }) => {
        const streams = [];

        let updatedAt: number;

        // group stream in same day
        for (const page of pages) {
          for (const stream of page.streams) {
            streams.push(stream);
          }

          if (updatedAt) {
            updatedAt = Math.max(updatedAt, page.updatedAt);
          } else {
            updatedAt = page.updatedAt;
          }
        }

        return {
          pages: [{ dataSource: { streams }, updatedAt }],
          pageParams: [],
        };
      },
      getNextPageParam: (lastPage) => {
        const time = lastPage.streams[23]?.startTime;

        if (!time) return undefined;

        return { endAt: time };
      },
    });
  }

  onClear() {
    this.streamsQry.updateQueryKey(this._queryKey());
  }

  onDateRangeChange(range: [Date, Date]) {
    this.streamsQry.updateQueryKey(
      this._queryKey(Number(endOfDay(range[1])), Number(startOfDay(range[0])))
    );
  }

  private _queryKey(startAt?: number, endAt?: number): QueryKey {
    return [
      "youtube_streams",
      {
        startAt,
        endAt,
        status: ["live", "ended"],
        orderBy: ["start_time", "desc"],
      },
      [this.vtuber.id],
    ];
  }

  trackBy(_: number, item: Stream): string {
    return item.streamId;
  }
}
