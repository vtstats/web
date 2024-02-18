import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { CHAT_CURRENCIES } from "src/app/shared/tokens";
import { CurrencyService } from "src/app/shared/config/currency.service";

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  selector: "vts-currency-settings",
  templateUrl: "currency-settings.html",
})
export class CurrencySettings {
  public config = inject(CurrencyService);
  public currencies = inject(CHAT_CURRENCIES);
}
