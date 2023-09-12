import { NgFor } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { ThemeService } from "src/app/shared/config/theme.service";

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor],
  selector: "vts-theme-settings",
  templateUrl: "theme-settings.html",
})
export class ThemeSettings {
  themeSetting = inject(ThemeService).themeSetting;

  readonly options = [
    { label: "System default", value: "followSystem" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];
}
