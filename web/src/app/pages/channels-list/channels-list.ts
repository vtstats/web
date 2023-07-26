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
import { listChannels } from "src/app/shared/api/entrypoint";
import { VTuberService } from "src/app/shared/config/vtuber.service";
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
export default class ChannelList implements OnInit {
  private qry = inject(QryService);
  private route = inject(ActivatedRoute);
  private vtubers = inject(VTuberService);

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
        channels: [...this.vtubers.selected].map(
          (id) => ({ vtuberId: id } as any)
        ),
      },
      queryKey: ["listChannels", { platform, ids: [...this.vtubers.selected] }],
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
