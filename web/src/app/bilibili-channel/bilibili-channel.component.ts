import { OnInit, Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatSort, MatTableDataSource } from "@angular/material";

import * as vtubers from "vtubers";

import { ChannelsResponse } from "../models";

type Channel = ChannelsResponse["channels"][0];

@Component({
  selector: "hs-bilibili-channel",
  templateUrl: "./bilibili-channel.component.html",
  styleUrls: ["./bilibili-channel.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BilibiliChannelComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  updatedAt = "";

  dataSource: MatTableDataSource<Channel>;

  ngOnInit() {
    const res: ChannelsResponse = this.route.snapshot.data.data;

    this.dataSource = new MatTableDataSource(res.channels);
    this.dataSource.sort = this.sort;
    this.updatedAt = res.updatedAt;
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
    "subs",
    "dailySubs",
    "weeklySubs",
    "monthlySubs",
    "views",
    "dailyViews",
    "weeklyViews",
    "monthlyViews"
  ];

  findVTuber(id: string) {
    for (const item of vtubers.items) {
      for (const vtuber of item.members) {
        if (vtuber.id == id) return vtuber;
      }
    }
  }

  private getTotal(path: (_: Channel) => number) {
    return this.dataSource.data
      .map(path)
      .reduce((acc, value) => acc + value, 0);
  }

  get totalSubs(): number {
    return this.getTotal(v => v.subs);
  }

  get totalDailySubs(): number {
    return this.getTotal(v => v.dailySubs);
  }

  get totalWeeklySubs(): number {
    return this.getTotal(v => v.weeklySubs);
  }

  get totalMonthlySubs(): number {
    return this.getTotal(v => v.monthlySubs);
  }

  get totalViews(): number {
    return this.getTotal(v => v.views);
  }

  get totalDailyViews(): number {
    return this.getTotal(v => v.dailyViews);
  }

  get totalWeeklyViews(): number {
    return this.getTotal(v => v.weeklyViews);
  }

  get totalMonthlyViews(): number {
    return this.getTotal(v => v.monthlyViews);
  }
}
