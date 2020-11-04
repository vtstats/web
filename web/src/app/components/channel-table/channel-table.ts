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

  _dataSoruce = new MatTableDataSource<Channel>([]);

  @Input() loading: boolean;

  @Input() set dataSouce(dataSouce: Array<Channel>) {
    this._dataSoruce.data = dataSouce;
  }

  get data() {
    if (this.loading) {
      return new Array(7);
    } else {
      return this._dataSoruce;
    }
  }

  get displayedColumns(): string[] {
    if (this.loading) {
      return [
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
    } else {
      return [
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
    }
  }

  ngAfterViewInit() {
    this._dataSoruce.sort = this.sort;
  }

  trackBy(_: number, channel: Channel): string {
    return channel?.vtuberId;
  }

  getTotal(path: Exclude<keyof Channel, "vtuberId" | "kind">): number {
    return this._dataSoruce.data.reduce((acc, item) => acc + item[path], 0);
  }
}
