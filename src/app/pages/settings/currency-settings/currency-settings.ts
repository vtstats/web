import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { CHAT_CURRENCIES } from "src/app/pages/streams-detail/stream-events/tokens";
import { CurrencyService } from "src/app/shared/config/currency.service";

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, CommonModule],
  selector: "hls-currency-settings",
  templateUrl: "currency-settings.html",
})
export class CurrencySettings {
  public config = inject(CurrencyService);
  public currencies = inject(CHAT_CURRENCIES);
}
