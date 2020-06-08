import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";

import { Channel, ChannelListResponse } from "src/app/models";

@Component({
  selector: "hs-bilibili-channel",
  templateUrl: "./bilibili-channel.component.html",
  styleUrls: ["./bilibili-channel.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BilibiliChannelComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  updatedAt = "";
  dataSource: MatTableDataSource<Channel>;

  ngOnInit() {
    const res: ChannelListResponse = this.route.snapshot.data.data;

    this.dataSource = new MatTableDataSource(res.channels);
    this.dataSource.sort = this.sort;
    this.updatedAt = res.updatedAt;
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

  private getTotal(path: (_: Channel) => number) {
    return this.dataSource.data
      .map(path)
      .reduce((acc, value) => acc + value, 0);
  }

  get totalSubs(): number {
    return this.getTotal((v) => v.subscriberCount);
  }

  get totalDailySubs(): number {
    return this.getTotal((v) => v.dailySubscriberCount);
  }

  get totalWeeklySubs(): number {
    return this.getTotal((v) => v.weeklySubscriberCount);
  }

  get totalMonthlySubs(): number {
    return this.getTotal((v) => v.monthlySubscriberCount);
  }

  get totalViews(): number {
    return this.getTotal((v) => v.viewCount);
  }

  get totalDailyViews(): number {
    return this.getTotal((v) => v.dailyViewCount);
  }

  get totalWeeklyViews(): number {
    return this.getTotal((v) => v.weeklyViewCount);
  }

  get totalMonthlyViews(): number {
    return this.getTotal((v) => v.monthlyViewCount);
  }
}
