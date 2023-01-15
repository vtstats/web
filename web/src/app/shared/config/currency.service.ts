import { Injectable } from "@angular/core";
import { from, shareReplay } from "rxjs";

import { StorageSubject } from "./storage";

@Injectable({ providedIn: "root" })
export class CurrencyService {
  currencySettings$ = new StorageSubject<string>("vts:currencySetting", "JPY");

  exchangeRate$ = from(
    import("./exchangeRate").then((mod) => mod.default.data)
  ).pipe(shareReplay(1));
}
