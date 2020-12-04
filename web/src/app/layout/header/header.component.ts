import { Component, EventEmitter, Output } from "@angular/core";

import { ConfigService } from "src/app/shared";
import { getLocaleId } from "src/i18n/locale";

@Component({
  selector: "hs-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter();

  constructor(private config: ConfigService) {}

  toggleDarkMode() {
    if (this.config.theme === "dark") {
      this.config.setTheme("default");
    } else {
      this.config.setTheme("dark");
    }
  }

  selectLanguage(lang: string) {
    if (getLocaleId() !== lang) {
      this.config.setLang(lang);
    }
  }
}
