import { formatCurrency } from "@angular/common";
import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import { combineLatest, map, Observable } from "rxjs";

import { PaidChat, codeToSymbol } from "src/app/shared/api/entrypoint";
import { CurrencyService } from "./currency.service";

@Pipe({
  standalone: true,
  name: "useCurrency",
})
export class UseCurrencyPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);
  private currencyService = inject(CurrencyService);

  transform(
    chat: PaidChat | PaidChat[],
    currency?: string
  ): Observable<string> {
    if (currency) {
      return this.currencyService.exchangeRate$.pipe(
        map((quotes) => this._sum(chat, currency, quotes))
      );
    }

    return combineLatest({
      settings: this.currencyService.currencySettings$,
      quotes: this.currencyService.exchangeRate$,
    }).pipe(map(({ quotes, settings }) => this._sum(chat, settings, quotes)));
  }

  _sum(
    chats: PaidChat | PaidChat[],
    currency: string,
    quotes: Record<string, number>
  ): string {
    let value = 0;

    if (Array.isArray(chats)) {
      value = chats.reduce(
        (acc, chat) => acc + this._convert(chat, currency, quotes),
        0
      );
    } else {
      value = this._convert(chats, currency, quotes);
    }

    let symbol = codeToSymbol[currency];

    return formatCurrency(value, this.locale, symbol || currency);
  }

  _convert(
    chat: PaidChat,
    currency: string,
    quotes: Record<string, number>
  ): number {
    if (!chat.code || !(`USD-${chat.code}` in quotes)) {
      return 0;
    }

    if (chat.code === currency) {
      return chat.value;
    }

    if (chat.code === "USD") {
      return chat.value * quotes[`USD-${currency}`];
    }

    if (currency === "USD") {
      return chat.value / quotes[`USD-${chat.code}`];
    }

    return (
      (chat.value / quotes[`USD-${chat.code}`]) * quotes[`USD-${currency}`]
    );
  }
}
