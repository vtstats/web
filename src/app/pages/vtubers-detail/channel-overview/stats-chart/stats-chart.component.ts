import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
} from "@angular/core";
import { startOfHour, subDays } from "date-fns";

import { Channel, Platform } from "src/app/models";
import {
  channelRevenueStats,
  channelSubscriberStats,
  channelViewStats,
} from "src/app/shared/api/entrypoint";
import { StatsComparisonComponent } from "./comparison";
import { NameComponent } from "./inner-chart";

import { CurrencyService } from "src/app/shared/config/currency.service";
import { query } from "src/app/shared/qry";

type QueryKey = [
  `channel-stats/${"revenue" | "view" | "subscriber"}`,
  { channelId: number; startAt?: Date; endAt?: Date }
];

type ChannelStatsKind = "subscriber" | "view" | "revenue";

@Component({
  standalone: true,
  imports: [NameComponent, StatsComparisonComponent],
  selector: "vts-stats-chart",
  template: `
    <div class="flex flex-row flex-wrap items-center">
      <div class="w-full sm:w-4/12">
        <vts-stats-comparison
          [platform]="channel().platform"
          [kind]="kind()"
          [rows]="channelStatsQry().data || []"
        />
      </div>

      <div class="w-full sm:w-8/12">
        <vts-channel-stats-inner-chart
          [lineColor]="colors().line"
          [areaColor]="colors().area"
          [rows]="channelStatsQry().data || []"
          [precision]="precision()"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent {
  precision = signal<number>(null);
  @Input("precision") set _precision(precision: number) {
    this.precision.set(precision);
  }

  channel = signal<Channel | null>(null);
  @Input({ alias: "channel", required: true }) set _channel(channel: Channel) {
    this.channel.set(channel);
  }

  kind = signal<ChannelStatsKind | null>(null);
  @Input("kind") set _kind(kind: ChannelStatsKind) {
    this.kind.set(kind);
  }

  currency = inject(CurrencyService);

  channelStatsQry = query<
    Array<[number, number]> | Array<[number, Record<string, number>]>,
    unknown,
    Array<[number, number]>,
    Array<[number, number]> | Array<[number, Record<string, number>]>,
    QueryKey
  >(() => {
    const now = startOfHour(Date.now());
    const endAt = now;
    const startAt = subDays(now, this.precision());
    const kind = this.kind();

    return {
      queryKey: [
        `channel-stats/${kind}`,
        { channelId: this.channel()?.channelId, startAt, endAt },
      ],

      queryFn: ({
        queryKey: [_, { channelId, startAt, endAt }],
      }): Promise<
        Array<[number, number]> | Array<[number, Record<string, number>]>
      > =>
        kind === "subscriber"
          ? channelSubscriberStats(channelId, startAt, endAt)
          : kind === "revenue"
          ? channelRevenueStats(channelId, startAt, endAt)
          : channelViewStats(channelId, startAt, endAt),

      select: (res) => this._select(res),

      staleTime: Infinity,
    };
  });

  colors = computed(() => {
    switch (this.channel()?.platform) {
      case Platform.YOUTUBE:
        return { area: "#ff525255", line: "#f44336" };
      case Platform.TWITCH:
        return { area: "#7c4dff55", line: "#673ab7" };
      default:
        return { area: "#64b5f655", line: "#03a9f4" };
    }
  });

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
}
