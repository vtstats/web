import { NgIf } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { formatDuration } from "date-fns";

import { Menu } from "src/app/components/menu/menu";
import { Channel } from "src/app/models";
import { LocaleService } from "src/app/shared/config/locale.service";
import { StatsChartComponent } from "./stats-chart/stats-chart.component";

@Component({
  standalone: true,
  imports: [NgIf, MatDividerModule, StatsChartComponent, Menu],
  selector: "vts-channel-overview",
  templateUrl: "channel-overview.html",
})
export class ChannelOverview {
  private locale = inject(LocaleService);

  @Input() channels: Channel[] = [];

  precision: number = 7;
  channelIdx: number = 0;

  get precisionOptions() {
    return [7, 30, 90].map((p) => ({
      value: p,
      label: formatDuration({ days: p }, { locale: this.locale.dateFns }),
    }));
  }

  get channelOptions() {
    return this.channels.map((ch, idx) => ({
      label: ch.platform,
      value: idx,
    }));
  }
}
