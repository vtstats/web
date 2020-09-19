import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { Channel } from "src/app/models";
import { ApiService } from "src/app/shared";

@Component({
  selector: "hs-youtube-channel",
  templateUrl: "./youtube-channel.component.html",
})
export class YoutubeChannelComponent implements OnInit {
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
    this.title.setTitle("YouTube Channels | HoloStats");

    this.loading = true;
    this.api.getYouTubeChannels().subscribe((res) => {
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

  getTotal(path: Exclude<keyof Channel, "vtuberId">): number {
    return this.dataSource.data.reduce((acc, item) => acc + item[path], 0);
  }
}
