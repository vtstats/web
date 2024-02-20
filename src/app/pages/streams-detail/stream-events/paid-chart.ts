import { CurrencyPipe, DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  Signal,
  computed,
  inject,
  input,
} from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { type EChartsOption } from "echarts";

import { Chart } from "src/app/components/chart/chart";
import { Menu } from "src/app/components/menu/menu";
import { Paid } from "src/app/shared/api/entrypoint";
import { CurrencyService } from "src/app/shared/config/currency.service";
import { UseCurrencyPipe } from "src/app/shared/config/use-currency.pipe";
import { CHAT_CURRENCIES } from "src/app/shared/tokens";

@Component({
  standalone: true,
  selector: "vts-stream-events-paid-chart",
  imports: [
    CurrencyPipe,
    DecimalPipe,
    UseCurrencyPipe,
    Menu,
    Chart,
    MatTableModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col sm:flex-row">
      <div class="sm:w-4/12 w-full h-80 relative">
        <vts-chart [options]="options()" [height]="320" />
        <div class="absolute right-0 bottom-4">
          <vts-menu
            [showLabel]="false"
            [options]="currencyOptions"
            [value]="currency.currencySetting()"
            (change)="currency.currencySetting.set($event)"
          />
        </div>
        <div
          class="absolute left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 text-2xl"
        >
          {{ totalValue() | currency: currency.currencySetting() }}
        </div>
      </div>

      <div class="sm:w-8/12 w-full overflow-auto max-h-80 -mat-table-density-2">
        <table class="sm:px-8 p-0" mat-table [dataSource]="dataSource()">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row; index as i">
              <div
                class="inline-block w-2 h-2 mr-1 rounded-full"
                [style.background-color]="colors[i]"
              ></div>
              {{ getName(row.name) }}
            </td>
          </ng-container>
          <ng-container matColumnDef="count">
            <th mat-header-cell *matHeaderCellDef class="!text-right">Count</th>
            <td mat-cell *matCellDef="let row" class="!text-right">
              {{ row.count | number }}
            </td>
          </ng-container>
          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef class="!text-right">Value</th>
            <td mat-cell *matCellDef="let row" class="!text-right">
              {{ row.value | currency: currency.currencySetting() }}
            </td>
          </ng-container>
          <tr
            mat-header-row
            class="sticky top-0"
            *matHeaderRowDef="displayedColumns"
          ></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
    </div>
  `,
})
export class PaidChart {
  currency = inject(CurrencyService);
  currencies = inject(CHAT_CURRENCIES);
  locale = inject(LOCALE_ID);

  paid = input<Paid[] | undefined>([]);

  dataSource: Signal<
    { name: string; code: string; value: number; count: number }[]
  > = computed(() => {
    const exchange = this.currency.exchange();
    const dataSource = [];
    for (const p of this.paid() || []) {
      const index = dataSource.findIndex((i) => i.code === p.code);
      const value = exchange[p.code] * p.value;
      if (index === -1) {
        dataSource.push({ code: p.code, count: 1, value, name: p.code });
      } else {
        dataSource[index].count += 1;
        dataSource[index].value += value;
      }
    }
    dataSource.sort((a, b) => b.value - a.value);
    return dataSource;
  });

  totalValue = computed(() =>
    this.dataSource().reduce((acc, p) => acc + p.value, 0),
  );

  options = computed<EChartsOption>(() => ({
    series: [
      {
        type: "pie",
        radius: ["60%", "80%"],
        center: ["50%", "50%"],
        data: this.dataSource(),
        color: this.colors,
        label: { show: false },
      },
    ],
  }));

  readonly displayedColumns = ["name", "count", "value"];

  readonly colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#9E9E9E",
    "#607D8B",
  ];

  getName(code: string) {
    return this.currencies.find((c) => c[0] === code)?.[1];
  }

  get currencyOptions() {
    return this.currencies.map((c) => ({
      value: c[0],
      label: c[0] + ", " + c[1],
    }));
  }
}
