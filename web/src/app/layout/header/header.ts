import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from "@angular/core";

import { ConfigService } from "src/app/shared";
import { getLocaleId } from "src/i18n";

@Component({
  selector: "hs-header",
  templateUrl: "header.html",
  styleUrls: ["header.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Header {
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
