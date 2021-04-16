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

import type { ChannelEX } from "src/app/models";

@Component({
  selector: "hs-channel-table-ex",
  templateUrl: "channel-table-ex.html",
  styleUrls: ["../channel-table/channel-table.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "channel-table" },
})
export class ChannelTableEX implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  data = new MatTableDataSource<ChannelEX>([]);

  @Input() set dataSouce(dataSouce: Array<ChannelEX>) {
    this.data.data = dataSouce;
  }

  displayedColumns: string[] = [
    "profile",
    "name",
    "videoCount",
    "weeklyVideo",
    "weeklyLive",
    "weeklyDuration",
    "monthlyVideo",
    "monthlyLive",
    "monthlyDuration",
  ];

  ngAfterViewInit() {
    this.data.sort = this.sort;
  }

  trackBy(_: number, channel: ChannelEX): string {
    return channel?.vtuberId;
  }

  getTotal(path: Exclude<keyof ChannelEX, "vtuberId" | "kind">): number {
    return this.data.data.reduce((acc, item) => acc + item[path], 0);
  }
}

@Component({
  selector: "hs-channel-table-ex-shimmer",
  templateUrl: "../channel-table/channel-table-shimmer.html",
  styleUrls: ["../channel-table/channel-table.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "channel-table" },
})
export class ChannelTableEXShimmer {
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
