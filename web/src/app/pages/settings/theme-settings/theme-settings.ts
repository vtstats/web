import { Component } from "@angular/core";
import { ConfigService } from "src/app/shared";

@Component({
  selector: "hls-theme-settings",
  templateUrl: "theme-settings.html",
})
export class ThemeSettings {
  readonly themes = [
    { label: "System default", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  constructor(public config: ConfigService) {}
}
