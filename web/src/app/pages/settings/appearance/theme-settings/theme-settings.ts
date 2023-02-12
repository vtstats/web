import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { ThemeService } from "src/app/shared/config/theme.service";

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, CommonModule],
  selector: "hls-theme-settings",
  templateUrl: "theme-settings.html",
})
export class ThemeSettings {
  settings$ = inject(ThemeService).themeSetting$;

  readonly options = [
    { label: "System default", value: "follow-system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];
}
