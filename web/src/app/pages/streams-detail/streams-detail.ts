import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { StreamReportKind, StreamReportResponse } from "src/app/models";
import {
  PaidChat,
  streamPaidChats,
  streamReports,
} from "src/app/shared/api/entrypoint";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { StreamLiveChatChart } from "./stream-live-chat-chart/stream-live-chat-chart";
import { StreamPaidChatChart } from "./stream-paid-chat-chart/stream-paid-chat-chart";
import { StreamsSummary } from "./stream-summary/stream-summary";
import { StreamViewersChart } from "./stream-viewers-chart/stream-viewers-chart";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    StreamLiveChatChart,
    StreamPaidChatChart,
    StreamsSummary,
    StreamViewersChart,
    UseQryPipe,
  ],
  selector: "hls-streams-detail",
  templateUrl: "streams-detail.html",
})
export default class StreamsDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private qry = inject(QryService);
  private title = inject(Title);

  streamDetailQry: Qry<
    StreamReportResponse,
    unknown,
    StreamReportResponse,
    unknown,
    [string, string]
  >;

  paidChatQry: Qry<
    PaidChat[],
    unknown,
    PaidChat[],
    PaidChat[],
    [string, string]
  >;

  ngOnInit() {
    const streamId = this.route.snapshot.paramMap.get("id");

    this.streamDetailQry = this.qry.create({
      queryKey: ["stream", streamId],
      queryFn: ({ queryKey: [_, id] }) =>
        streamReports({
          ids: [id],
          metrics: [
            StreamReportKind.youtubeStreamViewer,
            StreamReportKind.youtubeStreamLike,
            StreamReportKind.youtubeLiveChatMessage,
          ],
        }),
      onSuccess: (res) => {
        if (res.streams.length === 0) {
          this.router.navigateByUrl("/404");
        } else {
          this.title.setTitle(res.streams[0].title + " | HoloStats");
        }
      },
    });

    this.paidChatQry = this.qry.create({
      queryKey: ["streams_paid_chat", streamId],
      queryFn: ({ queryKey: [_, id] }) => streamPaidChats(id),
    });
  }
}
