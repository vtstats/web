import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { FilterGroup } from "src/app/components/filter-group/filter-group";
import { ChannelListResponse } from "src/app/models";
import { ConfigService } from "src/app/shared";
import { listChannels } from "src/app/shared/api/entrypoint";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { ChannelTable } from "./channel-table/channel-table";

@Component({
  standalone: true,
  selector: "hls-channels-list",
  templateUrl: "channels-list.html",
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FilterGroup,
    RouterModule,
    ChannelTable,
    UseQryPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelList implements OnInit {
  private config = inject(ConfigService);
  private qry = inject(QryService);
  private route = inject(ActivatedRoute);

  channelsQry: Qry<
    ChannelListResponse,
    unknown,
    ChannelListResponse,
    ChannelListResponse,
    [string, { platform: string; ids: string[] }]
  >;

  ngOnInit() {
    const platform: string = this.route.snapshot.data.platform;

    this.channelsQry = this.qry.create({
      placeholderData: {
        updatedAt: 0,
        channels: [...this.config.vtuber].map(
          (id) => ({ vtuberId: id } as any)
        ),
      },
      queryKey: ["listChannels", { platform, ids: [...this.config.vtuber] }],
      queryFn: ({ queryKey: [_, { platform, ids }] }) =>
        listChannels(platform, ids),
    });
  }

  onClear() {
    this.channelsQry.updateSelect(null);
  }

  onVTuberChange(ids: Set<string>) {
    if (ids.size === 0) {
      this.onClear();
    } else {
      this.channelsQry.updateSelect((x) => ({
        updatedAt: x.updatedAt,
        channels: x.channels.filter((x) => ids.has(x.vtuberId)),
      }));
    }
  }
}
