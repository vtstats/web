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
import { PlatformFilter } from "src/app/components/filter-group/platform-filter/platform-filter";
import { Menu } from "src/app/components/menu/menu";
import { RefreshButton } from "src/app/components/refresh-button/refresh-button";
import { Channel, ChannelStatsSummary, Platform } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { VTuberService } from "src/app/shared/config/vtuber.service";
import { QryService } from "src/app/shared/qry";
import { query } from "src/app/shared/qry/qry.signal";
import { ChannelStatsTable } from "../components/channel-stats-table/channel-stats-table";

@Component({
  standalone: true,
  selector: "vts-channel-subscriber",
  templateUrl: "./subscriber.html",
  imports: [
    NgIf,
    Menu,
    ChannelStatsTable,
    VTuberFilter,
    PlatformFilter,
    SelectVtuberAlert,
    RefreshButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChannelSubscriber {
  private qry = inject(QryService);
  private vtubers = inject(VTuberService);

  vtuberSelected = signal(new Set<string>());

  platform = signal(Platform.YOUTUBE as string);

  channels = computed<Channel[]>(() => {
    const vtuberSelected = this.vtuberSelected();
    const platform = this.platform();

    let channels = this.vtubers
      .selectedChannels()
      .filter((c) => c.platform === platform);

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

  data = computed(() =>
    this.result().data.map((c) => ({
      vtuberId: c.vtuberId,
      value: c.subscriber,
      delta1d: c.subscriber - c.subscriber1dAgo,
      delta7d: c.subscriber - c.subscriber7dAgo,
      delta30d: c.subscriber - c.subscriber30dAgo,
    }))
  );

  updatedAt = computed(() => {
    return new Date();
  });
}
