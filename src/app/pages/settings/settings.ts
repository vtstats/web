import { Component } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

import { ThemeSettings } from "./theme-settings/theme-settings";
import { DisplayLanguageComponent } from "./display-language/display-language.component";
import { NameLanguageComponent } from "./name-language/name-language.component";
import { CurrencySettings } from "./currency-settings/currency-settings";
import { TimezoneSettings } from "./timezone-settings/timezone-settings";
import { VTubersSettings } from "./vtubers-settings/vtubers-settings";
import { YouTubeSettings } from "./youtube-settings/youtube-settings";

@Component({
  standalone: true,
  imports: [
    YouTubeSettings,
    DisplayLanguageComponent,
    NameLanguageComponent,
    CurrencySettings,
    TimezoneSettings,
    ThemeSettings,
    VTubersSettings,
    MatDividerModule,
  ],
  selector: "hls-settings",
  templateUrl: "settings.html",
})
export default class Settings {}
