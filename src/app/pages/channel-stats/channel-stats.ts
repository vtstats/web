import {
  AfterRenderPhase,
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { injectQuery } from "@tanstack/angular-query-experimental";
import { SelectVtuberAlert } from "src/app/components/alert/select-vtuber-alert";
import { PlatformFilter } from "src/app/components/filter-group/platform-filter/platform-filter";
import { VTuberFilter } from "src/app/components/filter-group/vtuber-filter/vtuber-filter";
import { Menu } from "src/app/components/menu/menu";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { Channel, ChannelStatsKind, Platform } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { CurrencyService } from "src/app/shared/config/currency.service";
import { VTuberService } from "src/app/shared/config/vtuber.service";

import {
  ChannelStatsRow,
  ChannelStatsTable,
} from "./components/channel-stats-table/channel-stats-table";
import { CurrencyFilter } from "./components/currency-filter/currency-filter";
import { LoadingTable } from "./components/loading-table/loading-table";

@Component({
  standalone: true,
  selector: "vts-channel-stats",
  templateUrl: "./channel-stats.html",
  imports: [
    ChannelStatsTable,
    PlatformFilter,
    VTuberFilter,
    SelectVtuberAlert,
    RefreshButton,
    Menu,
    CurrencyFilter,
    LoadingTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChannelStats {
  private vtubers = inject(VTuberService);
  kind = inject(ActivatedRoute).snapshot.data.kind;

  currency = inject(CurrencyService);

  vtuberFilter = signal(new Set<string>());
  platformFilter = signal(Platform.YOUTUBE as string);

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

  result = injectQuery(() => {
    const channels = this.channels();
    const kind = this.kind;

    return {
      placeholderData: channels.map((c) => ({ vtuberId: c.vtuberId }) as any),
      enabled: this.csr() && channels.length > 0,
      queryKey: [
        "channel-stats/summary",
        { channelIds: channels.map((c) => c.channelId), kind },
      ] as const,
      queryFn: (ctx) =>
        api.channelStatsSummary(ctx.queryKey[1].channelIds, kind),
      staleTime: 5 * 60 * 1000, // 5min
    };
  });

  data = computed(() => {
    const exchange = this.currency.exchange();
    const channels = this.vtubers.selectedChannels();
    const data = this.result.data();

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

    return data.reduce(
      (acc, stats) => {
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
      },
      <ChannelStatsRow[]>[],
    );
  });

  updatedAt = computed(() => {
    const data = this.result.data();
    if (!data) return null;
    return Math.max(...data.map((i) => i.updatedAt));
  });

  csr = signal(false);

  constructor() {
    afterNextRender(() => this.csr.set(true), {
      phase: AfterRenderPhase.Write,
    });
  }
}
