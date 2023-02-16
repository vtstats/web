import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";

import type { Report, Stream, StreamReportKind } from "src/app/models";
import { DurationPipe, NamePipe, TickService } from "src/app/shared";
import { PaidChat, streamPaidChats } from "src/app/shared/api/entrypoint";
import { UseCurrencyPipe } from "src/app/shared/config/use-currency.pipe";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    UseQryPipe,
    DurationPipe,
    NamePipe,
    UseCurrencyPipe,
    NgOptimizedImage,
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

  liveChatQry: Qry<PaidChat[], unknown, number, PaidChat[], [string, string]>;

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
      queryFn: ({ queryKey: [_, id] }) => streamPaidChats(id),
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
