import { Component } from "@angular/core";

import { ThemeSettings } from "./theme-settings/theme-settings";

@Component({
  standalone: true,
  imports: [ThemeSettings],
  selector: "hls-appearance",
  templateUrl: "./appearance.component.html",
})
export class AppearanceComponent {}
