import { NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
  signal,
} from "@angular/core";
import { QueryObserverOptions } from "@tanstack/query-core";

import { SelectVtuberAlert } from "src/app/components/alert/select-vtuber-alert";
import { VTuberFilter } from "src/app/components/filter-group/vtuber-filter/vtuber-filter";
import { Menu } from "src/app/components/menu/menu";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { Channel, ChannelStatsSummary, Platform } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { CurrencyService } from "src/app/shared/config/currency.service";
import { VTuberService } from "src/app/shared/config/vtuber.service";
import { QryService } from "src/app/shared/qry";
import { query } from "src/app/shared/qry/qry.signal";
import { CHAT_CURRENCIES } from "../../streams-detail/stream-events/tokens";
import { ChannelStatsTable } from "../components/channel-stats-table/channel-stats-table";

@Component({
  standalone: true,
  selector: "vts-channel-revenue",
  templateUrl: "./revenue.html",
  imports: [
    NgIf,
    ChannelStatsTable,
    VTuberFilter,
    Menu,
    SelectVtuberAlert,
    RefreshButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChannelRevenue {
  private qry = inject(QryService);
  private vtubers = inject(VTuberService);

  currency = inject(CurrencyService);
  currencies = inject(CHAT_CURRENCIES);
  currencySetting = inject(CurrencyService).currencySetting;

  vtuberSelected = signal(new Set<string>());

  channels = computed<Channel[]>(() => {
    const vtuberSelected = this.vtuberSelected();

    let channels = this.vtubers
      .selectedChannels()
      .filter((c) => c.platform === Platform.YOUTUBE);

    if (vtuberSelected.size > 0) {
      channels = channels.filter((c) => vtuberSelected.has(c.vtuberId));
    }

    return channels;
  });

  options: Signal<
    QueryObserverOptions<
      Array<ChannelStatsSummary>,
      any,
      Array<ChannelStatsSummary>,
      Array<ChannelStatsSummary>,
      ["channel-stats/summary", { channelIds: number[] }]
    >
  > = computed(() => {
    const channels = this.channels();

    return {
      placeholderData: channels.map((c) => ({ vtuberId: c.vtuberId } as any)),
      enabled: channels.length > 0,
      queryKey: [
        "channel-stats/summary",
        { channelIds: channels.map((c) => c.channelId) },
      ],
      queryFn: (ctx) => api.channelStatsSummary(ctx.queryKey[1].channelIds),
      staleTime: 5 * 60 * 1000, // 5min
    };
  });

  result = query(this.qry.client, this.options);

  data = computed(() => {
    const exchange = this.currency.exchange();

    const sum = (map: Record<string, number>): number => {
      if (!map) return 0;

      return Object.entries(map).reduce((acc, [code, value]) => {
        if (code in exchange) {
          return (acc + value * exchange[code]) | 0;
        }
        return acc;
      }, 0);
    };

    return this.result().data.map((channel) => {
      const value = sum(channel.revenue);

      return {
        vtuberId: channel.vtuberId,
        value,
        delta1d: value - sum(channel.revenue1dAgo),
        delta7d: value - sum(channel.revenue7dAgo),
        delta30d: value - sum(channel.revenue30dAgo),
      };
    });
  });

  updatedAt = computed(() => {
    return new Date();
  });

  get currencyOptions() {
    return this.currencies.map((c) => ({
      value: c[0],
      label: c[0] + ", " + c[1],
    }));
  }
}
