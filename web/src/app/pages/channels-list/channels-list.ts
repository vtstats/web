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
import { Helmet } from "src/app/components/helmet/helmet.component";
import { ChannelListResponse } from "src/app/models";
import { TITLE } from "src/app/routes";
import { ConfigService } from "src/app/shared";
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
    Helmet,
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
  title = inject(TITLE);

  platform: string = this.route.snapshot.data.platform;

  channelsQry: Qry<
    ChannelListResponse,
    unknown,
    ChannelListResponse,
    ChannelListResponse,
    [string, string[]]
  >;

  ngOnInit() {
    this.channelsQry = this.qry.create({
      placeholderData: {
        updatedAt: 0,
        channels: [...this.config.vtuber].map(
          (id) => ({ vtuberId: id } as any)
        ),
      },
      queryKey: [`${this.platform}_channels`, [...this.config.vtuber]],
      queryFn: ({ queryKey: [_, ids] }) =>
        fetch(
          `https://holoapi.poi.cat/api/v4/${this.platform}_channels?ids=` +
            ids.join(",")
        ).then((res) => res.json()),
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
