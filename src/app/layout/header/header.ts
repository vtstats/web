import { Component, inject, LOCALE_ID } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";

import { ConfigService } from "src/app/shared";
import { ThemeService } from "src/app/shared/config/theme.service";
import { DrawerService } from "src/app/shared/services/drawer";

@Component({
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  selector: "hls-header",
  templateUrl: "header.html",
  styles: [
    `
      :host {
        background-color: var(--mat-sidenav-content-background-color);
      }
    `,
  ],
  host: {
    class: "fixed top-0 right-0 left-0 z-10 h-16",
  },
})
export class Header {
  private theme = inject(ThemeService);
  private config = inject(ConfigService);
  private localeId = inject(LOCALE_ID);

  drawerService = inject(DrawerService);

  nextTheme() {
    this.theme.themeSetting.set(
      this.theme.theme() === "dark" ? "light" : "dark"
    );
  }

  selectLanguage(lang: string) {
    if (this.localeId !== lang) {
      this.config.setLang(lang);
    }
  }
}
