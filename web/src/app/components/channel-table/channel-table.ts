import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import type { Channel } from "src/app/models";

@Component({
  selector: "hs-channel-table",
  templateUrl: "channel-table.html",
  styleUrls: ["channel-table.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "channel-table" },
})
export class ChannelTable implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  data = new MatTableDataSource<Channel>([]);

  @Input() set dataSouce(dataSouce: Array<Channel>) {
    this.data.data = dataSouce;
  }

  displayedColumns: string[] = [
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

  ngAfterViewInit() {
    this.data.sort = this.sort;
  }

  trackBy(_: number, channel: Channel): string {
    return channel?.vtuberId;
  }

  getTotal(path: Exclude<keyof Channel, "vtuberId" | "kind">): number {
    return this.data.data.reduce((acc, item) => acc + item[path], 0);
  }
}

@Component({
  selector: "hs-channel-table-shimmer",
  templateUrl: "channel-table-shimmer.html",
  styleUrls: ["channel-table.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "channel-table" },
})
export class ChannelTableShimmer {
  @ViewChild(MatSort) sort: MatSort;

  data = new Array(7);

  displayedColumns: string[] = [
    "shimmerProfile",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
    "shimmerText",
  ];
}
