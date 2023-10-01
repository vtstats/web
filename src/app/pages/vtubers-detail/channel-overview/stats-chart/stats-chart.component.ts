import { NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  inject,
} from "@angular/core";
import { startOfHour, subDays } from "date-fns";

import { Channel, Platform } from "src/app/models";
import {
  channelRevenueStats,
  channelSubscriberStats,
  channelViewStats,
} from "src/app/shared/api/entrypoint";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";
import { StatsComparisonComponent } from "./comparison";
import { NameComponent } from "./inner-chart";

import { CurrencyService } from "src/app/shared/config/currency.service";

type QueryKey = [
  `channel-stats/${"revenue" | "view" | "subscriber"}`,
  { channelId: number; startAt?: Date; endAt?: Date }
];

@Component({
  standalone: true,
  imports: [NameComponent, NgIf, UseQryPipe, StatsComparisonComponent],
  selector: "vts-stats-chart",
  template: `
    <div
      *ngIf="channelStatsQry | useQry as result"
      class="flex flex-row flex-wrap items-center"
    >
      <div class="w-full sm:w-4/12">
        <vts-stats-comparison
          [platform]="channel.platform"
          [kind]="kind"
          [rows]="result.data || []"
        />
      </div>

      <div class="w-full sm:w-8/12">
        <vts-channel-stats-inner-chart
          [lineColor]="colors.line"
          [areaColor]="colors.area"
          [rows]="result.data || []"
          [precision]="precision"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent implements OnChanges {
  @Input() precision: number;
  @Input({ required: true }) channel: Channel;
  @Input() kind: "subscriber" | "view" | "revenue" = "subscriber";

  qry = inject(QryService);
  currency = inject(CurrencyService);

  channelStatsQry: Qry<
    Array<[number, number]> | Array<[number, Record<string, number>]>,
    unknown,
    Array<[number, number]>,
    Array<[number, number]> | Array<[number, Record<string, number>]>,
    QueryKey
  >;

  constructor() {
    this.channelStatsQry = this.qry.create({
      queryKey: this._queryKey(),

      queryFn: ({
        queryKey: [_, { channelId, startAt, endAt }],
      }): Promise<
        Array<[number, number]> | Array<[number, Record<string, number>]>
      > =>
        this.kind === "subscriber"
          ? channelSubscriberStats(channelId, startAt, endAt)
          : this.kind === "revenue"
          ? channelRevenueStats(channelId, startAt, endAt)
          : channelViewStats(channelId, startAt, endAt),

      select: (res) => this._select(res),

      staleTime: Infinity,
    });
  }

  ngOnChanges() {
    this.channelStatsQry.updateQueryKey(this._queryKey());
  }

  get colors() {
    switch (this.channel.platform) {
      case Platform.YOUTUBE:
        return { area: "#ff525255", line: "#f44336" };
      case Platform.TWITCH:
        return { area: "#7c4dff55", line: "#673ab7" };
      default:
        return { area: "#64b5f655", line: "#03a9f4" };
    }
  }

  _select(
    arr: Array<[number, number]> | Array<[number, Record<string, number>]>
  ): Array<[number, number]> {
    if (arr.length == 0) return [];

    if (typeof arr[0][1] === "number") {
      return arr as Array<[number, number]>;
    }

    const exchange = this.currency.exchange();

    return arr.map(([t, map]) => {
      const value = Object.entries(map as Record<string, number>).reduce(
        (acc, [code, value]) => {
          if (exchange[code]) {
            acc += value * exchange[code];
          }
          return acc;
        },
        0
      );

      return [t, value | 0] as [number, number];
    });
  }

  _queryKey(): QueryKey {
    const now = startOfHour(Date.now());

    const endAt = now;
    const startAt = subDays(now, this.precision);

    return [
      `channel-stats/${this.kind}`,
      { channelId: this.channel?.channelId, startAt, endAt },
    ];
  }
}
