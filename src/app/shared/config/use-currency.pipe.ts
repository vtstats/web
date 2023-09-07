import { formatCurrency } from "@angular/common";
import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";

import { codeToSymbol, Paid } from "src/app/shared/api/entrypoint";
import { CurrencyService } from "./currency.service";

@Pipe({
  standalone: true,
  name: "useCurrency",
})
export class UseCurrencyPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);
  private currencyService = inject(CurrencyService);

  transform(chat: Paid | Paid[], currency?: string): string {
    let value = 0;

    if (Array.isArray(chat)) {
      value = chat
        .map((c) => c.value * this.currencyService.exchange()[c.code])
        .reduce((acc, i) => acc + i, 0);
    } else {
      value = chat.value * this.currencyService.exchange()[chat.value];
    }

    let displayCurrency = currency || this.currencyService.currencySetting();

    let symbol = codeToSymbol[displayCurrency];

    return formatCurrency(value, this.locale, symbol || displayCurrency);
  }
}
