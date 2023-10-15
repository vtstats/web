import {
  DecimalPipe,
  NgIf,
  TitleCasePipe,
  formatCurrency,
  formatNumber,
} from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  LOCALE_ID,
  inject,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { Platform } from "src/app/models";
import { codeToSymbol } from "src/app/shared/api/entrypoint";
import { CurrencyService } from "src/app/shared/config/currency.service";
import { ChannelStatsKind } from "./stats-chart.component";

@Component({
  standalone: true,
  imports: [DecimalPipe, TitleCasePipe, NgIf, MatIconModule],
  selector: "vts-stats-comparison",
  template: `
    <div class="mat-h4 mb-1 mat-secondary-text">
      {{ title | titlecase }}
    </div>

    <div class="flex flex-row items-center sm:block">
      <div class="mb-1 mat-h1 mr-1">
        {{ text }}
      </div>

      <div
        *ngIf="delta > 0"
        class="mat-h4 mb-1 inline-flex flex-row items-center up-color"
      >
        <mat-icon class="mr-1" svgIcon="arrow-up" />
        {{ delta | number }}
      </div>

      <div
        *ngIf="delta < 0"
        class="mat-h4 mb-1 inline-flex flex-row items-center down-color"
      >
        <mat-icon class="mr-1" svgIcon="arrow-down" />
        {{ delta | number }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComparisonComponent {
  @Input() rows: [number, number][] = [];
  @Input() kind: ChannelStatsKind | null | undefined;
  @Input() platform?: Platform;

  private locale = inject(LOCALE_ID);
  private currency = inject(CurrencyService);

  get text(): string {
    if (
      !this.rows ||
      this.rows.length === 0 ||
      !this.rows[this.rows.length - 1][1]
    ) {
      return "----";
    }

    const value = this.rows[this.rows.length - 1][1];

    if (this.kind === "revenue") {
      const code = this.currency.currencySetting();
      return formatCurrency(
        value,
        this.locale,
        codeToSymbol[code] || code,
        code,
        "1.0-0"
      );
    }

    return formatNumber(value, this.locale);
  }

  get title(): string {
    switch (this.kind) {
      default:
      case "subscriber": {
        return $localize`:@@subscribers:Subscribers`;
      }
      case "view": {
        return $localize`:@@views:Views`;
      }
      case "revenue": {
        return $localize`:@@revenue:Revenue`;
      }
    }
  }

  get delta(): number {
    if (!this.rows) return 0;

    const head = this.rows[0]?.[1];
    const tail = this.rows[this.rows.length - 1]?.[1];

    return tail - head;
  }
}
