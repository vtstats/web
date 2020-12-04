import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { translate } from "src/i18n/translations";

import { Channel } from "src/app/models";
import { ApiService } from "src/app/shared";

@Component({
  selector: "hs-bilibili-channel",
  templateUrl: "./bilibili-channel.component.html",
})
export class BilibiliChannelComponent implements OnInit {
  constructor(private api: ApiService, private title: Title) {}

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  loading = false;
  updatedAt = "";
  dataSource = new MatTableDataSource<Channel>([]);

  ngOnInit() {
    this.title.setTitle(`${translate("bilibiliChannel")} | HoloStats`);

    this.loading = true;
    this.api.getBilibiliChannels().subscribe((res) => {
      this.loading = false;
      this.dataSource.data = res.channels;
      this.updatedAt = res.updatedAt;
    });
  }

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

  trackBy(_: number, channel: Channel): string {
    return channel.vtuberId;
  }

  getTotal(key: Exclude<keyof Channel, "vtuberId">): number {
    return this.dataSource.data.reduce((acc, cur) => acc + cur[key], 0);
  }
}
