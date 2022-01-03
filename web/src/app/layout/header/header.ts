import {
  Component,
  EventEmitter,
  Inject,
  LOCALE_ID,
  Output,
  ViewEncapsulation,
} from "@angular/core";

import { ConfigService } from "src/app/shared";

@Component({
  selector: "hls-header",
  templateUrl: "header.html",
  styleUrls: ["header.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  @Output() menuClick = new EventEmitter();

  constructor(
    private config: ConfigService,
    @Inject(LOCALE_ID) private localeId: string
  ) {}

  toggleDarkMode() {
    if (this.config.theme === "dark") {
      this.config.setTheme("default");
    } else {
      this.config.setTheme("dark");
    }
  }

  selectLanguage(lang: string) {
    if (this.localeId !== lang) {
      this.config.setLang(lang);
    }
  }
}
