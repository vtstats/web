import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  NgIf,
  NgOptimizedImage,
  NgSwitch,
  NgSwitchCase,
} from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";

import {
  Platform,
  StreamEventKind,
  type Stream,
  type StreamsEvent,
} from "src/app/models";
import {
  AvatarPipe,
  DurationPipe,
  NamePipe,
  TickService,
} from "src/app/shared";
import * as api from "src/app/shared/api/entrypoint";
import { Paid } from "src/app/shared/api/entrypoint";
import { CurrencyService } from "src/app/shared/config/currency.service";
import { UseCurrencyPipe } from "src/app/shared/config/use-currency.pipe";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [
    RouterModule,
    DatePipe,
    AsyncPipe,
    DecimalPipe,
    NgIf,
    MatTooltipModule,
    MatIconModule,
    UseQryPipe,
    DurationPipe,
    NamePipe,
    AvatarPipe,
    UseCurrencyPipe,
    NgOptimizedImage,
    NgSwitch,
    NgSwitchCase,
  ],
  selector: "vts-stream-summary",
  templateUrl: "stream-summary.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamSummary implements OnInit {
  everySecond$ = inject(TickService).everySecond$;
  private qry = inject(QryService);
  currency = inject(CurrencyService);

  @Input() stream: Stream | null = null;

  revenueQry: Qry<
    Array<StreamsEvent>,
    unknown,
    Array<Paid>,
    Array<StreamsEvent>,
    ["stream-events", { streamId: number }]
  >;

  chatCountQry: Qry<
    Array<[number, number, number]>,
    unknown,
    number,
    Array<[number, number, number]>,
    ["stream-stats/chat", { streamId: number }]
  >;

  ratesQry!: Qry<
    { likes: number; dislikes: number },
    unknown,
    { likes: number; dislikes: number },
    { likes: number; dislikes: number },
    ["youtubeLikes", { platformId: string }]
  >;

  get link(): string {
    if (this.stream.platform !== Platform.YOUTUBE) {
      return null;
    }

    return "https://youtu.be/" + this.stream.platformId;
  }

  ngOnInit() {
    if (!this.stream) return;

    this.revenueQry = this.qry.create({
      queryKey: ["stream-events", { streamId: this.stream.streamId }],
      queryFn: () => api.streamEvents(this.stream.streamId),
      select: (events) =>
        events.reduce((acc, event) => {
          switch (event.kind) {
            case StreamEventKind.YOUTUBE_SUPER_CHAT: {
              acc.push({
                code: event.value.currencyCode,
                color: event.value.color,
                value: Number.parseFloat(event.value.amount),
              });
              break;
            }
            case StreamEventKind.YOUTUBE_SUPER_STICKER: {
              acc.push({
                code: event.value.currencyCode,
                color: event.value.color,
                value: Number.parseFloat(event.value.amount),
              });
              break;
            }
            case StreamEventKind.TWITCH_CHEERING: {
              acc.push({
                code: "USD",
                color: "",
                value: event.value.bits / 100,
              });
              break;
            }
            case StreamEventKind.TWITCH_HYPER_CHAT: {
              acc.push({
                code: event.value.currency_code,
                color: "",
                value: Number.parseFloat(event.value.amount),
              });
              break;
            }
          }
          return acc;
        }, <Paid[]>[]),
    });

    this.chatCountQry = this.qry.create({
      queryKey: ["stream-stats/chat", { streamId: this.stream.streamId }],
      queryFn: () => api.streamChatStats(this.stream.streamId),
      select: (rows) => rows.reduce((acc, cur) => acc + cur[1], 0),
    });

    this.ratesQry = this.qry.create({
      queryKey: ["youtubeLikes", { platformId: this.stream.platformId }],
      queryFn: () => api.youtubeLikes(this.stream.platformId),
      enabled: this.stream.platform === Platform.YOUTUBE,
    });
  }
}
