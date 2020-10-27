import {
  Component,
  EventEmitter,
  Output,
  Inject,
  LOCALE_ID,
} from "@angular/core";

import { ConfigService } from "src/app/shared";

@Component({
  selector: "hs-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter();

  constructor(
    private config: ConfigService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  toggleDarkMode = () => this.config.toggleDarkMode();

  selectLanguage(locale: string) {
    if (this.locale !== locale) {
      this.config.selectLanguage(locale);
    }
  }
}
