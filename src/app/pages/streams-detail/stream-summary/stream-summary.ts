import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  NgOptimizedImage,
} from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { injectQuery } from "@tanstack/angular-query-experimental";

import { Platform, StreamEventKind, type Stream } from "src/app/models";
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

@Component({
  standalone: true,
  imports: [
    RouterModule,
    DatePipe,
    AsyncPipe,
    DecimalPipe,
    MatTooltipModule,
    MatIconModule,
    DurationPipe,
    NamePipe,
    AvatarPipe,
    UseCurrencyPipe,
    NgOptimizedImage,
  ],
  selector: "vts-stream-summary",
  templateUrl: "stream-summary.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamSummary {
  everySecond$ = inject(TickService).everySecond$;

  currency = inject(CurrencyService);

  stream = input<Stream | null>(null);

  revenueTooltipText = computed(() => {
    const stream = this.stream();

    return (
      $localize`:@@revenue-tooltip-1:Only includes` +
      " " +
      (stream!.platform == "YOUTUBE"
        ? $localize`:@@revenue-tooltip-youtube:YouTube Super Chat & Super Sticker`
        : $localize`:@@revenue-tooltip-twitch:Twitch Cheering & Hyper Chat`)
    );
  });

  sanitizer = inject(DomSanitizer);

  revenueQry = injectQuery(() => {
    const st = this.stream();
    return {
      enabled: Boolean(st),
      queryKey: ["stream-events", { streamId: st?.streamId! }],
      queryFn: () => api.streamEvents(st!.streamId),
      select: (events) => {
        return events.reduce(
          (acc, event) => {
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
          },
          <Paid[]>[],
        );
      },
    };
  });

  chatCountQry = injectQuery(() => {
    const st = this.stream();
    return {
      enabled: Boolean(st),
      queryKey: ["stream-stats/chat", { streamId: st?.streamId! }],
      queryFn: () => api.streamChatStats(st?.streamId!),
      select: (rows) => rows.reduce((acc, cur) => acc + cur[1], 0),
    };
  });

  ratesQry = injectQuery(() => {
    const st = this.stream();
    return {
      enabled: !!st && st.platform === Platform.YOUTUBE,
      queryKey: ["youtubeLikes", { platformId: st?.platformId! }],
      queryFn: () => api.youtubeLikes(st?.platformId!),
    };
  });

  link = computed(() => {
    const st = this.stream();
    if (st && st.platform === Platform.YOUTUBE) {
      return this.sanitizer.bypassSecurityTrustUrl(
        "https://youtu.be/" + st.platformId,
      );
    }
    return null;
  });
}
