import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule } from "@angular/router";

import type {
  LiveChatHighlightResponse,
  Report,
  Stream,
  StreamReportKind,
} from "src/app/models";
import { DurationPipe, NamePipe, TickService } from "src/app/shared";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatGridListModule,
    UseQryPipe,
    DurationPipe,
    NamePipe,
  ],
  selector: "hls-stream-summary",
  templateUrl: "stream-summary.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamsSummary implements OnInit {
  everySecond$ = inject(TickService).everySecond$;
  private qry = inject(QryService);

  @Input() stream: Stream;
  @Input() reports: Report<StreamReportKind>[] = [];

  liveChatQry: Qry<
    LiveChatHighlightResponse,
    unknown,
    number,
    LiveChatHighlightResponse,
    [string, string]
  >;

  ratesQry: Qry<
    { likes: number; dislikes: number },
    unknown,
    { likes: number; dislikes: number },
    { likes: number; dislikes: number },
    [string, string]
  >;

  ngOnInit() {
    this.liveChatQry = this.qry.create({
      queryKey: ["streams_paid_chat", this.stream.streamId],
      queryFn: ({ queryKey: [_, id] }) =>
        fetch(
          `https://holoapi.poi.cat/api/v4/live_chat/highlight?id=${id}`
        ).then((res) => res.json()),
      select: (res) => res.paid.length,
    });

    this.ratesQry = this.qry.create({
      queryKey: ["youtube_votes", this.stream.streamId],
      queryFn: ({ queryKey: [_, id] }) =>
        fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${id}`).then(
          (res) => res.json()
        ),
    });
  }

  get likes(): number {
    return this.stream?.maxLikeCount;
  }

  get avg(): number {
    return this.stream?.averageViewerCount;
  }

  get max(): number {
    return this.stream?.maxViewerCount;
  }

  get liveChatCount(): number | undefined {
    const report = this.reports.find(
      // @ts-ignore TODO: fix typings
      (re) => re.kind === "youtube_live_chat"
    );

    return report?.rows.reduce((acc, cur) => acc + cur[1], 0);
  }
}
