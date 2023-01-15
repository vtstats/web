import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  LOCALE_ID,
  Output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { ConfigService } from "src/app/shared";
import {
  ThemeService,
  ThemeSetting,
} from "src/app/shared/config/theme.service";

@Component({
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
  ],
  selector: "hls-header",
  templateUrl: "header.html",
  host: {
    class: "fixed top-0 right-0 left-0 z-10 mat-bg-card h-16",
  },
})
export class Header {
  private theme = inject(ThemeService);
  private config = inject(ConfigService);
  private localeId = inject(LOCALE_ID);

  @Output() menuClick = new EventEmitter();

  isDarkTheme$ = this.theme.isDarkTheme$;

  nextTheme(value: ThemeSetting) {
    this.theme.themeSetting$.next(value);
  }

  selectLanguage(lang: string) {
    if (this.localeId !== lang) {
      this.config.setLang(lang);
    }
  }
}
