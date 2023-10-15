import { NgIf } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { formatDuration } from "date-fns";

import { Menu } from "src/app/components/menu/menu";
import { Channel } from "src/app/models";
import { DATE_FNS_LOCALE } from "src/app/shared/tokens";
import { StatsChartComponent } from "./stats-chart/stats-chart.component";

@Component({
  standalone: true,
  imports: [NgIf, MatDividerModule, StatsChartComponent, Menu],
  selector: "vts-channel-overview",
  templateUrl: "channel-overview.html",
})
export class ChannelOverview {
  dateFns = inject(DATE_FNS_LOCALE);

  @Input() channels: Channel[] = [];

  precision: 7 | 30 | 90 = 7;
  channelIdx: number = 0;

  get precisionOptions() {
    return [7, 30, 90].map((p) => ({
      value: p as 7 | 30 | 90,
      label: formatDuration({ days: p }, { locale: this.dateFns }),
    }));
  }

  get channelOptions() {
    return this.channels.map((ch, idx) => ({
      label: ch.platform,
      value: idx,
    }));
  }
}
