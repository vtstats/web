import { Injectable, computed, signal } from "@angular/core";

import * as api from "src/app/shared/api/entrypoint";
import { localStorageSignal } from "src/utils";

@Injectable({ providedIn: "root" })
export class CurrencyService {
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

  async initialize() {
    this.rates.set(await import("./currency.json").then((r) => r.default));
  }
}
