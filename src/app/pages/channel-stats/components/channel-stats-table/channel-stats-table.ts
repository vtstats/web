import { DecimalPipe, NgFor, NgIf, NgOptimizedImage } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";

import { AvatarPipe, NamePipe } from "src/app/shared";
import { DeltaCell } from "./delta-cell";

export type ChannelStatsRow = {
  vtuberId: string;
  value?: number;
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
    NgIf,
    NgFor,
    DecimalPipe,
    NamePipe,
    AvatarPipe,
    NgOptimizedImage,
    DeltaCell,
  ],
})
export class ChannelStatsTable implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  data = new MatTableDataSource<ChannelStatsRow>([]);

  @Input() set dataSource(dataSource: Array<ChannelStatsRow>) {
    if (dataSource) this.data.data = dataSource;
  }

  @Input() loading: boolean = false;
  @Input() valueLabel: string;

  readonly displayedColumns: string[] = [
    "profile",
    "name",
    "value",
    "delta1d",
    "delta7d",
    "delta30d",
  ];

  readonly dataColumns: {
    f: keyof ChannelStatsRow;
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

  columnTrackBy(_: number, column: { f: keyof ChannelStatsRow }): string {
    return column.f;
  }

  getTotal(field: keyof ChannelStatsRow): number {
    return this.data.data.reduce((acc, item) => acc + item[field as any], 0);
  }
}
