import { formatDate, formatNumber } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  computed,
  inject,
  input,
} from "@angular/core";
import { startOfHour, subDays } from "date-fns";
import type { EChartsOption } from "echarts";
import type { TopLevelFormatterParams } from "echarts/types/dist/shared";

import { Chart } from "src/app/components/chart/chart";
import { Channel, Platform } from "src/app/models";
import {
  channelRevenueStats,
  channelSubscriberStats,
  channelViewStats,
} from "src/app/shared/api/entrypoint";
import { CurrencyService } from "src/app/shared/config/currency.service";
import { query } from "src/app/shared/qry";
import { sampling } from "src/utils";

import { StatsComparisonComponent } from "./comparison";

type QueryKey = [
  `channel-stats/${"revenue" | "view" | "subscriber"}`,
  { channelId: number; startAt?: Date; endAt?: Date },
];

export type ChannelStatsKind = "subscriber" | "view" | "revenue";

@Component({
  standalone: true,
  imports: [Chart, StatsComparisonComponent],
  selector: "vts-stats-chart",
  template: `
    <div class="flex flex-row flex-wrap items-center">
      <div class="w-full sm:w-4/12">
        <vts-stats-comparison
          [platform]="channel()?.platform"
          [kind]="kind()"
          [rows]="channelStatsQry().data || []"
        />
      </div>

      <div class="w-full sm:w-8/12">
        <vts-chart
          [height]="100"
          [loading]="channelStatsQry().isLoading"
          [options]="options()"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent {
  private locale = inject(LOCALE_ID);

  precision = input<7 | 30 | 90 | null>(null);
  channel = input<Channel | null>(null);
  kind = input<ChannelStatsKind | null>(null);

  currency = inject(CurrencyService);

  channelStatsQry = query<
    Array<[number, number]> | Array<[number, Record<string, number>]>,
    unknown,
    Array<[number, number]>,
    Array<[number, number]> | Array<[number, Record<string, number>]>,
    QueryKey
  >(() => {
    const channel = this.channel();
    const precision = this.precision();
    const now = startOfHour(Date.now());
    const kind = this.kind();

    if (!precision || !channel || !kind) {
      return {
        enabled: false,
        queryKey: [`channel-stats/revenue`, { channelId: 0 }],
      };
    }

    return {
      queryKey: [
        `channel-stats/${kind}`,
        {
          channelId: channel.channelId,
          startAt: subDays(now, precision),
          endAt: startOfHour(Date.now()),
        },
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

  options = computed((): EChartsOption | null => {
    const rows = this.channelStatsQry().data;

    if (!rows) return null;

    const [areaColor, lineColor] = {
      [Platform.YOUTUBE]: ["#ff525255", "#f44336"],
      [Platform.TWITCH]: ["#7c4dff55", "#673ab7"],
      [Platform.BILIBILI]: ["#64b5f655", "#03a9f4"],
    }[this.channel()!.platform];

    const step = {
      7: 43200 * 1000, // 12 hours
      30: 2 * 86400 * 1000, // 2 days
      90: 6 * 86400 * 1000, // 6 days
    }[this.precision() || 7];

    const data = sampling(
      rows,
      { step },
      (row) => row[0],
      (row) => row[1],
      Math.max,
    );

    return {
      tooltip: {
        trigger: "axis",
        borderRadius: 4,
        backgroundColor: "white",
        borderWidth: 0,
        textStyle: {
          color: "#0F0F0F",
          fontSize: "14px",
          fontWeight: 500,
        },
        padding: [6, 8],
        formatter: (p) => this.tooltipFormatter(p),
      },
      grid: { left: 3, right: 3, top: 0, bottom: 0 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        splitLine: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: {
          inside: true,
          alignWithLabel: true,
          show: true,
          interval: 0,
          length: 2434,
        },
        max: "dataMax",
        min: "dataMin",
      },
      yAxis: {
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        max: ({ min, max }) => max + (max - min + 1) * 0.1,
        min: ({ min, max }) => min - (max - min + 1) * 0.1,
      },
      series: {
        data,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        color: lineColor,
        areaStyle: { color: areaColor },
      },
    } satisfies EChartsOption;
  });

  tooltipFormatter(p: TopLevelFormatterParams) {
    const d = (Array.isArray(p) ? p[0] : p) as { value: number[] };
    const h = d.value[0];
    const t = formatDate(h, "yyyy/MM/dd", this.locale);
    const v = d.value[1];
    const s = formatNumber(v, this.locale);
    return `<div class="text-xs text-[#737373]">${t}<br/></div><div class="text-sm">${s}</div>`;
  }

  _select(
    arr: Array<[number, number]> | Array<[number, Record<string, number>]>,
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
        0,
      );

      return [t, value | 0] as [number, number];
    });
  }
}
