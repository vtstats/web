import { Component } from "@angular/core";

import { TimezoneSettings } from "./timezone-settings/timezone-settings";
import { CurrencySettings } from "./currency-settings/currency-settings";

@Component({
  standalone: true,
  imports: [TimezoneSettings, CurrencySettings],
  selector: "hls-region",
  templateUrl: "./region.component.html",
})
export class RegionComponent {}
