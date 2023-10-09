import { Injectable, computed, inject, signal } from "@angular/core";

import { localStorageSignal } from "src/utils";
import { exchangeRatesQuery } from "../api/entrypoint";
import { QUERY_CLIENT } from "../tokens";

@Injectable({ providedIn: "root" })
export class CurrencyService {
  queryClient = inject(QUERY_CLIENT);

  currencySetting = localStorageSignal("vts:currencySetting", "JPY");

  rates = signal<Record<string, number>>({});

  exchange = computed<Record<string, number>>(() => {
    const rates = this.rates();
    const base = this.currencySetting();

    const result = {};

    Object.keys(rates).forEach((key) => {
      if (key === "EUR") {
        result[key] = 1;
      } else {
        result[key] = rates[base] / rates[key];
      }
    });

    return result;
  });

  constructor() {
    const res: Record<string, number> = this.queryClient.getQueryData(
      exchangeRatesQuery.queryKey
    );
    this.rates.set(res);
  }
}
