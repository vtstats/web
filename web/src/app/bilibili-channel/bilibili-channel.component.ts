import { OnInit, Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatSort, MatTableDataSource } from "@angular/material";

import * as vtubers from "vtubers";

import { VTuber } from "../models";

@Component({
  selector: "hs-bilibili-channel",
  templateUrl: "./bilibili-channel.component.html",
  styleUrls: ["./bilibili-channel.component.scss"]
})
export class BilibiliChannelComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  updatedAt = "";

  dataSource: MatTableDataSource<VTuber> = new MatTableDataSource([]);

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case "bilibiliSubs":
          return item.bilibiliStats.subs;
        case "bilibiliDailySubs":
          return item.bilibiliStats.dailySubs;
        case "bilibiliWeeklySubs":
          return item.bilibiliStats.weeklySubs;
        case "bilibiliMonthlySubs":
          return item.bilibiliStats.monthlySubs;
        case "bilibiliViews":
          return item.bilibiliStats.views;
        case "bilibiliDailyViews":
          return item.bilibiliStats.dailyViews;
        case "bilibiliWeeklyViews":
          return item.bilibiliStats.weeklyViews;
        case "bilibiliMonthlyViews":
          return item.bilibiliStats.monthlyViews;
        default:
          return item[property];
      }
    };

    this.dataSource.data = this.route.snapshot.data.data.vtubers;
    this.updatedAt = this.route.snapshot.data.data.updatedAt;
  }

  readonly hideRows: string[] = vtubers.items.reduce(
    (acc, item) => [
      ...acc,
      ...item.members.filter(m => m.bilibili == null).map(m => m.id)
    ],
    []
  );

  readonly displayedColumns: string[] = [
    "profile",
    "name",
    "bilibiliSubs",
    "bilibiliDailySubs",
    "bilibiliWeeklySubs",
    "bilibiliMonthlySubs",
    "bilibiliViews",
    "bilibiliDailyViews",
    "bilibiliWeeklyViews",
    "bilibiliMonthlyViews"
  ];

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const vtuber of item.members) {
        if (vtuber.id == id) return vtuber;
      }
    }
  }

  private getTotal(path: (_: VTuber) => number) {
    return this.dataSource.data
      .map(path)
      .reduce((acc, value) => acc + value, 0);
  }

  get totalBilibiliSubs(): number {
    return this.getTotal(v => v.bilibiliStats.subs);
  }

  get totalBilibiliDailySubs(): number {
    return this.getTotal(v => v.bilibiliStats.dailySubs);
  }

  get totalBilibiliWeeklySubs(): number {
    return this.getTotal(v => v.bilibiliStats.weeklySubs);
  }

  get totalBilibiliMonthlySubs(): number {
    return this.getTotal(v => v.bilibiliStats.monthlySubs);
  }

  get totalBilibiliViews(): number {
    return this.getTotal(v => v.bilibiliStats.views);
  }

  get totalBilibiliDailyViews(): number {
    return this.getTotal(v => v.bilibiliStats.dailyViews);
  }

  get totalBilibiliWeeklyViews(): number {
    return this.getTotal(v => v.bilibiliStats.weeklyViews);
  }

  get totalBilibiliMonthlyViews(): number {
    return this.getTotal(v => v.bilibiliStats.monthlyViews);
  }
}
