import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { StorageSubject } from "./storage";

@Injectable({ providedIn: "root" })
export class CurrencyService {
  currencySettings$ = new StorageSubject<string>("vts:currencySetting", "JPY");

  exchangeRate$ = new BehaviorSubject<Record<string, number>>({});

  async initialize() {
    const mod = await import("./exchangeRate");
    this.exchangeRate$.next(mod.default.data);
  }
}
