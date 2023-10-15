import { NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { SelectVtuberAlert } from "src/app/components/alert/select-vtuber-alert";
import { PlatformFilter } from "src/app/components/filter-group/platform-filter/platform-filter";
import { VTuberFilter } from "src/app/components/filter-group/vtuber-filter/vtuber-filter";
import { Menu } from "src/app/components/menu/menu";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import {
  Channel,
  ChannelStatsKind,
  ChannelStatsSummary,
  Platform,
} from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { CurrencyService } from "src/app/shared/config/currency.service";
import { VTuberService } from "src/app/shared/config/vtuber.service";
import { query } from "src/app/shared/qry";
import { CHAT_CURRENCIES } from "src/app/shared/tokens";
import {
  ChannelStatsRow,
  ChannelStatsTable,
} from "./components/channel-stats-table/channel-stats-table";

@Component({
  standalone: true,
  selector: "vts-channel-stats",
  templateUrl: "./channel-stats.html",
  imports: [
    NgIf,
    ChannelStatsTable,
    PlatformFilter,
    VTuberFilter,
    SelectVtuberAlert,
    RefreshButton,
    Menu,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChannelStats {
  private vtubers = inject(VTuberService);
  route = inject(ActivatedRoute);
  kind = this.route.snapshot.data.kind;

  currency = inject(CurrencyService);
  currencies = inject(CHAT_CURRENCIES);

  vtuberFilter = signal(new Set<string>());
  platformFilter = signal(Platform.YOUTUBE as string);
  currencyFilter = inject(CurrencyService).currencySetting;

  channels = computed<Channel[]>(() => {
    const vtuberFilter = this.vtuberFilter();
    const platformFilter = this.platformFilter();

    let channels = this.vtubers
      .selectedChannels()
      .filter((c) => c.platform === platformFilter);

    if (vtuberFilter.size > 0) {
      channels = channels.filter((c) => vtuberFilter.has(c.vtuberId));
    }

    return channels;
  });

  result = query<
    Array<ChannelStatsSummary>,
    any,
    Array<ChannelStatsSummary>,
    Array<ChannelStatsSummary>,
    ["channel-stats/summary", { channelIds: number[]; kind: string }]
  >(() => {
    const channels = this.channels();
    const kind = this.route.snapshot.data.kind;

    return {
      placeholderData: channels.map((c) => ({ vtuberId: c.vtuberId } as any)),
      enabled: channels.length > 0,
      queryKey: [
        "channel-stats/summary",
        { channelIds: channels.map((c) => c.channelId), kind },
      ],
      queryFn: (ctx) =>
        api.channelStatsSummary(ctx.queryKey[1].channelIds, kind),
      staleTime: 5 * 60 * 1000, // 5min
    };
  });

  data = computed(() => {
    const exchange = this.currency.exchange();
    const channels = this.vtubers.selectedChannels();
    const data = this.result().data;

    if (!data) return [];

    const sum = (map: Record<string, number>): number => {
      if (!map) return 0;

      return Object.entries(map).reduce((acc, [code, value]) => {
        if (code in exchange) {
          return acc + ((value * exchange[code]) | 0);
        }
        return acc;
      }, 0);
    };

    return data.reduce((acc, stats) => {
      const channel = channels.find((c) => c.channelId == stats.channelId);

      if (channel) {
        if (stats.kind === ChannelStatsKind.REVENUE) {
          const value = sum(stats.value);
          acc.push({
            vtuberId: channel.vtuberId,
            value,
            delta1d: value - sum(stats.value1DayAgo),
            delta7d: value - sum(stats.value7DaysAgo),
            delta30d: value - sum(stats.value30DaysAgo),
          });
        } else {
          acc.push({
            vtuberId: channel.vtuberId,
            value: stats.value,
            delta1d: stats.value - stats.value1DayAgo,
            delta7d: stats.value - stats.value7DaysAgo,
            delta30d: stats.value - stats.value30DaysAgo,
          });
        }
      }

      return acc;
    }, <ChannelStatsRow[]>[]);
  });

  updatedAt = computed(() => {
    return new Date();
  });

  get valueLabel(): string {
    switch (this.route.snapshot.data.kind) {
      case "SUBSCRIBER": {
        return $localize`:@@subscribers:Subscribers`;
      }
      case "VIEW": {
        return $localize`:@@views:Views`;
      }
      case "REVENUE": {
        return $localize`:@@revenue:Revenue`;
      }
      default: {
        return "";
      }
    }
  }

  get currencyOptions() {
    return this.currencies.map((c) => ({
      value: c[0],
      label: c[0] + ", " + c[1],
    }));
  }
}
