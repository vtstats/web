import { Component, inject } from "@angular/core";
import { Menu } from "src/app/components/menu/menu";

import { CurrencyService } from "src/app/shared/config/currency.service";
import { CHAT_CURRENCIES } from "src/app/shared/tokens";

@Component({
  standalone: true,
  selector: "vts-currency-filter",
  imports: [Menu],
  template: ` <vts-menu
    [showLabel]="false"
    [options]="currencies"
    [value]="currency.currencySetting()"
    (change)="currency.currencySetting.set($event)"
  />`,
})
export class CurrencyFilter {
  currency = inject(CurrencyService);

  currencies = inject(CHAT_CURRENCIES).map((c) => ({
    value: c[0],
    label: c[0] + ", " + c[1],
  }));
}
