import { DOCUMENT } from "@angular/common";
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
    @Inject(LOCALE_ID) private localeId: string,
    @Inject(DOCUMENT) private document: Document
  ) {}

  toggleDarkMode() {
    if (this.document.body.classList.contains("dark")) {
      this.config.theme$.next("light");
    } else {
      this.config.theme$.next("dark");
    }
  }

  selectLanguage(lang: string) {
    if (this.localeId !== lang) {
      this.config.setLang(lang);
    }
  }
}
