import { CommonModule } from "@angular/common";
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

import type { Channel } from "src/app/models";
import { NamePipe } from "src/app/shared";

@Component({
  standalone: true,
  selector: "hls-channel-table",
  templateUrl: "channel-table.html",
  styleUrls: ["channel-table.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "channel-table" },
  imports: [
    MatTableModule,
    MatSortModule,
    RouterModule,
    CommonModule,
    NamePipe,
  ],
})
export class ChannelTable implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  data = new MatTableDataSource<Channel>([]);

  @Input() set dataSource(dataSource: Array<Channel>) {
    if (dataSource) this.data.data = dataSource;
  }

  @Input() loading: boolean;

  readonly displayedColumns: string[] = [
    "profile",
    "name",
    "subscriberCount",
    "dailySubscriberCount",
    "weeklySubscriberCount",
    "monthlySubscriberCount",
    "viewCount",
    "dailyViewCount",
    "weeklyViewCount",
    "monthlyViewCount",
  ];

  readonly dataColumns: [key: string, title: string, showColor: boolean][] = [
    ["subscriberCount", $localize`:@@subscribers:Subscribers`, false],
    ["dailySubscriberCount", $localize`:@@lastDay:Last Day`, true],
    ["weeklySubscriberCount", $localize`:@@last7Days:Last 7 Days`, true],
    ["monthlySubscriberCount", $localize`:@@last30Days:Last 30 Days`, true],
    ["viewCount", $localize`:@@views:Views`, false],
    ["dailyViewCount", $localize`:@@lastDay:Last Day`, true],
    ["weeklyViewCount", $localize`:@@last7Days:Last 7 Days`, true],
    ["monthlyViewCount", $localize`:@@last30Days:Last 30 Days`, true],
  ];

  ngAfterViewInit() {
    this.data.sort = this.sort;
  }

  rowTrackBy(_: number, channel: Channel): string {
    return channel?.vtuberId;
  }

  columnTrackBy(
    _: number,
    column: [key: string, title: string, showColor: boolean]
  ): string {
    return column[0];
  }

  getTotal(path: Exclude<keyof Channel, "vtuberId" | "kind">): number {
    return this.data.data.reduce((acc, item) => acc + item[path], 0);
  }
}
