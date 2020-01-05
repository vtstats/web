import { OnInit, Component, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

import { ApiService } from "../services";
import { VTuber } from "../models";

enum Tab {
  youtube,
  bilibili
}

@Component({
  selector: "hs-vtubers-list",
  templateUrl: "./vtubers-list.component.html",
  styleUrls: ["./vtubers-list.component.scss"]
})
export class VTubersListComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private spinnerService: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  updatedAt = "";

  selectedTab = Tab.youtube;

  get bilibiliSelected() {
    return this.selectedTab == Tab.bilibili;
  }

  get youtubeSelected() {
    return this.selectedTab == Tab.youtube;
  }

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

    this.route.queryParams.subscribe(queryParams => {
      this.selectedTab =
        queryParams["tab"] == "bilibili" ? Tab.bilibili : Tab.youtube;
      this.filterContent();
    });

    this.spinnerService.show();
    this.apiService.getVTubers().subscribe(data => {
      this.spinnerService.hide();
      this.dataSource.data = data.vtubers;
      this.updatedAt = data.updatedAt;
    });
  }

  hideRows: string[] = [];
  displayedColumns: string[] = [];

  filterContent() {
    switch (this.selectedTab) {
      case Tab.youtube:
        this.displayedColumns = [
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
        this.hideRows = ["civia", "echo", "yogiri"];
        this.sort.active = "youtubeSubs";
        this.sort.direction = "desc";
        this.sort.sortChange.emit({
          active: "youtubeSubs",
          direction: "desc"
        });
        break;
      case Tab.bilibili:
        this.displayedColumns = [
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
        this.sort.active = "bilibiliSubs";
        this.sort.direction = "desc";
        this.hideRows = [
          "aki_alt",
          "choco_alt",
          "haato_alt",
          "kanata",
          "coco",
          "watame",
          "towa",
          "himemoriluna"
        ];
        this.sort.sortChange.emit({
          active: "bilibiliSubs",
          direction: "desc"
        });
        break;
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
