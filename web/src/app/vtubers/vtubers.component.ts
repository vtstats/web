import { OnInit, Component, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";

import { VTuber } from "@holostats/libs/models";

import { Config, ApiService } from "../services";

@Component({
  selector: "hs-vtubers",
  templateUrl: "./vtubers.component.html",
  styleUrls: ["./vtubers.component.scss"]
})
export class VTubersComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    public config: Config,

    private spinnerService: NgxSpinnerService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  updatedAt = "";

  dataSource: MatTableDataSource<VTuber> = new MatTableDataSource([]);

  ngOnInit() {
    this.spinnerService.show();
    this.apiService.getVTubers(this.config.selectedVTubers).subscribe(data => {
      this.spinnerService.hide();
      this.dataSource.data = data.vtubers;
      this.updatedAt = data.updatedAt;
    });

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case "youtubeSubs":
          return item.youtubeStats.subs;
        case "youtubeDailySubs":
          return item.youtubeStats.dailySubs;
        case "youtubeWeeklySubs":
          return item.youtubeStats.weeklySubs;
        case "youtubeViews":
          return item.youtubeStats.views;
        case "youtubeDailyViews":
          return item.youtubeStats.dailyViews;
        case "youtubeWeeklyViews":
          return item.youtubeStats.weeklyViews;
        case "bilibiliSubs":
          return item.bilibiliStats.subs;
        case "bilibiliDailySubs":
          return item.bilibiliStats.dailySubs;
        case "bilibiliWeeklySubs":
          return item.bilibiliStats.weeklySubs;
        case "bilibiliViews":
          return item.bilibiliStats.views;
        case "bilibiliDailyViews":
          return item.bilibiliStats.dailyViews;
        case "bilibiliWeeklyViews":
          return item.bilibiliStats.weeklyViews;
        default:
          return item[property];
      }
    };
  }

  get displayedColumns(): string[] {
    return this.config.selectedColumns.filter(c => c.length != 0);
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

  get totalYoutubeViews(): number {
    return this.getTotal(v => v.youtubeStats.views);
  }

  get totalYoutubeDailyViews(): number {
    return this.getTotal(v => v.youtubeStats.dailyViews);
  }

  get totalYoutubeWeeklyViews(): number {
    return this.getTotal(v => v.youtubeStats.weeklyViews);
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

  get totalBilibiliViews(): number {
    return this.getTotal(v => v.bilibiliStats.views);
  }

  get totalBilibiliDailyViews(): number {
    return this.getTotal(v => v.bilibiliStats.dailyViews);
  }

  get totalBilibiliWeeklyViews(): number {
    return this.getTotal(v => v.bilibiliStats.weeklyViews);
  }
}
