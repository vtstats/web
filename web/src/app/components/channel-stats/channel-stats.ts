import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { endOfDay, startOfDay, subDays } from "date-fns";

import { Channel, ChannelReportKind, Report, VTuber } from "src/app/models";
import { ApiService } from "src/app/shared";

@Component({
  selector: "hs-channel-stats",
  templateUrl: "channel-stats.html",
  styleUrls: ["channel-stats.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelStats implements OnInit {
  constructor(private api: ApiService) {}

  @Input() vtuber: VTuber;

  get shimmers(): Array<any> {
    return this.vtuber.youtube && this.vtuber.bilibili ? Array(4) : Array(2);
  }

  loading = false;

  channels: Channel[];
  reports: Report<ChannelReportKind>[];

  ngOnInit() {
    this.loading = true;

    const now = Date.now();

    this.api
      .channelReports({
        ids: [this.vtuber.id],
        metrics: [
          ChannelReportKind.youtubeChannelSubscriber,
          ChannelReportKind.youtubeChannelView,
          ChannelReportKind.bilibiliChannelSubscriber,
          ChannelReportKind.bilibiliChannelView,
        ],
        startAt: startOfDay(subDays(now, 7)),
        endAt: endOfDay(now),
      })
      .subscribe((res) => {
        this.loading = false;
        this.channels = res.channels;
        this.reports = res.reports;
      });
  }
}
