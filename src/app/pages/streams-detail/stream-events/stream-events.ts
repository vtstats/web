import { NgFor, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
} from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";

import { Menu } from "src/app/components/menu/menu";
import { Stream, StreamEventKind, StreamsEvent } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { Paid } from "src/app/shared/api/entrypoint";
import { UseCurrencyPipe } from "src/app/shared/config/use-currency.pipe";

import { query } from "src/app/shared/qry";
import { StreamEventsChart } from "./event-chart";
import { PaidChart } from "./paid-chart";

export type StreamEventsGroup = {
  superChats?: Array<Paid>;
  superSticker?: Array<Paid>;
  newMember?: Array<number>;
  memberMilestone?: Array<number>;
  twitchCheering?: Array<number>;
  twitchHyperChat?: Array<Paid>;
};

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    PaidChart,
    UseCurrencyPipe,
    StreamEventsChart,
    Menu,
    MatChipsModule,
  ],
  selector: "vts-stream-events-inner",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="chipOptions().length > 0; else noData">
      <div class="mx-4 mt-4 flex">
        <mat-chip-listbox
          [value]="selectedChip()"
          (change)="selectedChip.set($event.value)"
          hideSingleSelectionIndicator
        >
          <mat-chip-option
            *ngFor="let option of chipOptions()"
            [value]="option.value"
          >
            {{ option.label }}
          </mat-chip-option>
        </mat-chip-listbox>
      </div>

      <ng-container [ngSwitch]="selectedChip()">
        <vts-stream-events-paid-chart
          *ngSwitchCase="'superChats'"
          [paid]="group.superChats"
        />
        <vts-stream-events-paid-chart
          *ngSwitchCase="'superSticker'"
          [paid]="group.superSticker"
        />
        <vts-stream-events-chart
          *ngSwitchCase="'timed'"
          [group]="group"
          [stream]="stream"
        />
      </ng-container>
    </ng-container>

    <ng-template #noData>
      <div
        [style.height.px]="300"
        class="items-center justify-center flex mat-secondary-text tracking-widest text-lg"
      >
        NO DATA
      </div>
    </ng-template>
  `,
})
export class StreamEventsInner implements OnInit {
  @Input({ required: true }) group!: StreamEventsGroup;
  @Input({ required: true }) stream!: Stream;

  chipOptions = signal<Array<{ label: string; value: string }>>([]);
  selectedChip = signal<string>("");

  ngOnInit() {
    const options: Array<{ label: string; value: string }> = [];
    if (this.group.superChats) {
      options.push({
        value: "superChats",
        label: $localize`:@@super-chats:Super Chats`,
      });
    }
    if (this.group.superSticker) {
      options.push({
        value: "superSticker",
        label: $localize`:@@super-sticker:Super Sticker`,
      });
    }
    if (
      this.group.memberMilestone ||
      this.group.newMember ||
      this.group.superChats ||
      this.group.superSticker ||
      this.group.twitchCheering ||
      this.group.twitchHyperChat
    ) {
      options.push({
        value: "timed",
        label: $localize`:@@timed:Timed`,
      });
    }
    this.chipOptions.set(options);
    if (options.length > 0) {
      this.selectedChip.set(options[0].value);
    }
  }
}

@Component({
  standalone: true,
  imports: [StreamEventsInner, NgIf],
  selector: "vts-stream-events",
  template: `
    <div
      *ngIf="statsQry().data as result"
      class="mat-border-divider rounded border border-solid mb-4"
    >
      <vts-stream-events-inner [group]="result" [stream]="stream()!" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamEvents {
  stream = signal<Stream | null>(null);
  @Input("stream") set _stream(stream: Stream) {
    this.stream.set(stream);
  }

  statsQry = query<
    Array<StreamsEvent>,
    unknown,
    StreamEventsGroup,
    Array<StreamsEvent>,
    ["stream-events", { streamId: number }]
  >(() => {
    const st = this.stream();
    return {
      enabled: Boolean(st),
      queryKey: ["stream-events", { streamId: st?.streamId! }],
      queryFn: () => api.streamEvents(st?.streamId!),
      select: (events) =>
        events.reduce((acc, cur) => {
          switch (cur.kind) {
            case StreamEventKind.YOUTUBE_SUPER_CHAT: {
              acc.superChats ||= [];
              acc.superChats.push({
                //@ts-ignore
                time: cur.time,
                code: cur.value.currencyCode,
                color: cur.value.color,
                value: Number.parseFloat(cur.value.amount),
              });
              break;
            }

            case StreamEventKind.YOUTUBE_SUPER_STICKER: {
              acc.superSticker ||= [];
              acc.superSticker.push({
                //@ts-ignore
                time: cur.time,
                code: cur.value.currencyCode,
                color: cur.value.color,
                value: Number.parseFloat(cur.value.amount),
              });
              break;
            }

            case StreamEventKind.YOUTUBE_NEW_MEMBER: {
              acc.newMember ||= [];
              acc.newMember.push(cur.time);
              break;
            }

            case StreamEventKind.YOUTUBE_MEMBER_MILESTONE: {
              acc.newMember ||= [];
              acc.newMember.push(cur.time);
              break;
            }

            case StreamEventKind.TWITCH_CHEERING: {
              acc.twitchCheering ||= [];
              acc.twitchCheering.push(cur.time);
              break;
            }

            case StreamEventKind.TWITCH_HYPER_CHAT: {
              acc.twitchHyperChat ||= [];
              acc.twitchHyperChat.push({
                //@ts-ignore
                time: cur.time,
                code: cur.value.currency_code,
                value: Number.parseFloat(cur.value.amount),
              });
              break;
            }
          }
          return acc;
        }, {} as StreamEventsGroup),
    };
  });
}
