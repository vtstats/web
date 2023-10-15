import { Injectable, computed, inject } from "@angular/core";

import { localStorageSignal } from "src/utils";
import { EXCHANGE_RATES } from "../tokens";

@Injectable({ providedIn: "root" })
export class CurrencyService {
  exchangeRates = inject(EXCHANGE_RATES);

  currencySetting = localStorageSignal("vts:currencySetting", "JPY");

  exchange = computed<Record<string, number>>(() => {
    const base = this.currencySetting();

    const result: Record<string, number> = {};

    Object.keys(this.exchangeRates).forEach((key) => {
      if (key === "EUR") {
        result[key] = 1;
      } else {
        result[key] = this.exchangeRates[base] / this.exchangeRates[key];
      }
    });

    return result;
  });
}
