import { DecimalPipe, NgOptimizedImage } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";

import { NamePipe } from "src/app/shared";
import { CATALOG_VTUBERS } from "src/app/shared/tokens";
import { DeltaCell } from "./delta-cell";

export type ChannelStatsRow = {
  vtuberId: string;
  value: number;
  delta1d: number;
  delta7d: number;
  delta30d: number;
};

@Component({
  standalone: true,
  selector: "vts-channel-stats-table",
  templateUrl: "channel-stats-table.html",
  styleUrls: ["channel-stats-table.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "channel-stats-table" },
  imports: [
    MatTableModule,
    MatSortModule,
    RouterModule,
    DecimalPipe,
    NamePipe,
    NgOptimizedImage,
    DeltaCell,
  ],
})
export class ChannelStatsTable implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  vtubers = inject(CATALOG_VTUBERS);

  findVTuber(id: string) {
    return this.vtubers.find((v) => v.vtuberId === id);
  }

  data = new MatTableDataSource<ChannelStatsRow>([]);

  @Input() set dataSource(dataSource: Array<ChannelStatsRow>) {
    if (dataSource) this.data.data = dataSource;
  }

  @Input() loading: boolean = false;
  @Input({ required: true }) valueLabel!: string;

  readonly displayedColumns: string[] = [
    "profile",
    "name",
    "value",
    "delta1d",
    "delta7d",
    "delta30d",
  ];

  readonly dataColumns: {
    f: "value" | "delta1d" | "delta7d" | "delta30d";
    t: string;
  }[] = [
    {
      f: "delta1d",
      t: $localize`:@@last-day:Last Day`,
    },
    {
      f: "delta7d",
      t: $localize`:@@last-7days:Last 7 Days`,
    },
    {
      f: "delta30d",
      t: $localize`:@@last-30days:Last 30 Days`,
    },
  ];

  ngAfterViewInit() {
    this.data.sort = this.sort;
  }

  rowTrackBy(_: number, channel: ChannelStatsRow): string {
    return channel.vtuberId;
  }

  getTotal(field: "value" | "delta1d" | "delta7d" | "delta30d"): number {
    return this.data.data.reduce((acc, item) => acc + item[field], 0);
  }
}
