import { Component } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

import { AppearanceComponent } from "./appearance/appearance.component";
import { LanguageComponent } from "./language/language.component";
import { MiscellaneousComponent } from "./miscellaneous/miscellaneous.component";
import { RegionComponent } from "./region/region.component";
import { VTubersSettings } from "./vtubers-settings/vtubers-settings";
import { YouTubeSettings } from "./youtube-settings/youtube-settings";

@Component({
  standalone: true,
  imports: [
    YouTubeSettings,
    MiscellaneousComponent,
    AppearanceComponent,
    RegionComponent,
    LanguageComponent,
    VTubersSettings,
    MatDividerModule,
  ],
  selector: "hls-settings",
  templateUrl: "settings.html",
})
export class Settings {}
