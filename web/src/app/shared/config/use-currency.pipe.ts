import { formatCurrency } from "@angular/common";
import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import { combineLatest, map, Observable } from "rxjs";

import { CurrencyService } from "./currency.service";

@Pipe({
  standalone: true,
  name: "useCurrency",
})
export class UseCurrencyPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);
  private currencyService = inject(CurrencyService);

  transform(
    fromValue: number,
    fromCurrency: string,
    toCurrency?: string
  ): Observable<string> {
    if (toCurrency) {
      return this.currencyService.exchangeRate$.pipe(
        map((quotes) => {
          return formatCurrency(
            this._convert(fromValue, fromCurrency, toCurrency, quotes),
            this.locale,
            toCurrency
          );
        })
      );
    }

    return combineLatest({
      settings: this.currencyService.currencySettings$,
      quotes: this.currencyService.exchangeRate$,
    }).pipe(
      map(({ quotes, settings }) => {
        return formatCurrency(
          this._convert(fromValue, fromCurrency, settings, quotes),
          this.locale,
          settings
        );
      })
    );
  }

  _convert(
    fromValue: number,
    fromCurrency: string,
    toCurrency: string,
    quotes: { [quote: string]: number }
  ): number {
    if (fromCurrency === toCurrency) {
      return fromValue;
    }

    if (fromCurrency === "USD") {
      return fromValue * quotes[`USD-${toCurrency}`];
    }

    if (toCurrency === "USD") {
      return fromValue / quotes[`USD-${fromCurrency}`];
    }

    return (
      (fromValue / quotes[`USD-${fromCurrency}`]) * quotes[`USD-${toCurrency}`]
    );
  }
}
