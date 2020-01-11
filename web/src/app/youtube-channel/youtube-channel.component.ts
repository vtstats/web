import { OnInit, Component, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { ActivatedRoute } from "@angular/router";

import * as vtubers from "vtubers";

import { VTuber } from "../models";

@Component({
  selector: "hs-youtube-channel",
  templateUrl: "./youtube-channel.component.html",
  styleUrls: ["./youtube-channel.component.scss"]
})
export class YoutubeChannelComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  updatedAt = "";

  dataSource: MatTableDataSource<VTuber> = new MatTableDataSource([]);

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case "youtubeSubs":
          return item.youtubeStats.subs;
        case "youtubeDailySubs":
          return item.youtubeStats.dailySubs;
        case "youtubeWeeklySubs":
          return item.youtubeStats.weeklySubs;
        case "youtubeMonthlySubs":
          return item.youtubeStats.monthlySubs;
        case "youtubeViews":
          return item.youtubeStats.views;
        case "youtubeDailyViews":
          return item.youtubeStats.dailyViews;
        case "youtubeWeeklyViews":
          return item.youtubeStats.weeklyViews;
        case "youtubeMonthlyViews":
          return item.youtubeStats.monthlyViews;
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
      ...item.members.filter(m => m.youtube == null).map(m => m.id)
    ],
    []
  );

  readonly displayedColumns: string[] = [
    "profile",
    "name",
    "youtubeSubs",
    "youtubeDailySubs",
    "youtubeWeeklySubs",
    "youtubeMonthlySubs",
    "youtubeViews",
    "youtubeDailyViews",
    "youtubeWeeklyViews",
    "youtubeMonthlyViews"
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

  get totalYoutubeSubs(): number {
    return this.getTotal(v => v.youtubeStats.subs);
  }

  get totalYoutubeDailySubs(): number {
    return this.getTotal(v => v.youtubeStats.dailySubs);
  }

  get totalYoutubeWeeklySubs(): number {
    return this.getTotal(v => v.youtubeStats.weeklySubs);
  }

  get totalYoutubeMonthlySubs(): number {
    return this.getTotal(v => v.youtubeStats.monthlySubs);
  }

  get totalYoutubeViews(): number {
    return this.getTotal(v => v.youtubeStats.views);
  }

  get totalYoutubeDailyViews(): number {
    return this.getTotal(v => v.youtubeStats.dailyViews);
  }

  get totalYoutubeWeeklyViews(): number {
    return this.getTotal(v => v.youtubeStats.weeklyViews);
  }

  get totalYoutubeMonthlyViews(): number {
    return this.getTotal(v => v.youtubeStats.monthlyViews);
  }
}
