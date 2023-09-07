import { NgFor, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";

import { Menu } from "src/app/components/menu/menu";
import { Stream, StreamEventKind, StreamsEvent } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";
import { Paid } from "src/app/shared/api/entrypoint";
import { UseCurrencyPipe } from "src/app/shared/config/use-currency.pipe";
import { Qry, QryService, UseQryPipe } from "src/app/shared/qry";

import { StreamEventsChart } from "./event-chart";
import { PaidChart } from "./paid-chart";

export type StreamEventsGroup = {
  superChats?: Array<Paid>;
  superSticker?: Array<Paid>;
  newMember?: Array<number>;
  memberMilestone?: Array<number>;
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
  selector: "hls-stream-events-inner",
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
        <hls-stream-events-paid-chart
          *ngSwitchCase="'superChats'"
          [paid]="group.superChats"
        />
        <hls-stream-events-paid-chart
          *ngSwitchCase="'superSticker'"
          [paid]="group.superSticker"
        />
        <hls-stream-events-chart *ngSwitchCase="'time'" [group]="group" />
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
export class StreamEventsInner implements OnChanges {
  @Input() group: StreamEventsGroup;

  chipOptions = signal<Array<{ label: string; value: string }>>([]);
  selectedChip = signal<string>("");

  ngOnChanges() {
    const options: Array<{ label: string; value: string }> = [];
    if (this.group.superChats) {
      options.push({ value: "superChats", label: "Super Chats" });
    }
    if (this.group.superSticker) {
      options.push({ value: "superSticker", label: "Super Sticker" });
    }
    if (
      this.group.memberMilestone ||
      this.group.newMember ||
      this.group.superChats ||
      this.group.superSticker
    ) {
      options.push({ value: "time", label: "Time" });
    }
    this.chipOptions.set(options);
    if (options.length > 0) {
      this.selectedChip.set(options[0].value);
    }
  }
}

@Component({
  standalone: true,
  imports: [NgIf, UseQryPipe, StreamEventsInner],
  selector: "hls-stream-events",
  template: `
    <div
      *ngIf="statsQry | useQry as result"
      class="mat-border-divider rounded border border-solid mb-4"
    >
      <hls-stream-events-inner *ngIf="result.data" [group]="result.data" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamEvents implements OnInit {
  private qry = inject(QryService);

  @Input() stream: Stream;

  statsQry: Qry<
    Array<StreamsEvent>,
    unknown,
    StreamEventsGroup,
    Array<StreamsEvent>,
    ["stream-events", { streamId: number }]
  >;

  ngOnInit(): void {
    this.statsQry = this.qry.create({
      queryKey: ["stream-events", { streamId: this.stream.streamId }],
      queryFn: () => api.streamEvents(this.stream.streamId),
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
          }
          return acc;
        }, {} as StreamEventsGroup),
    });
  }
}
