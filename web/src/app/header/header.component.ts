import {
  Component,
  EventEmitter,
  Output,
  Inject,
  LOCALE_ID,
} from "@angular/core";
import { CookieService } from "ngx-cookie";

import { Config } from "../services";

@Component({
  selector: "hs-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter();

  constructor(
    public config: Config,
    @Inject(LOCALE_ID) private locale: string,
    private cookieService: CookieService
  ) {}

  selectLanguage(locale: string) {
    if (this.locale !== locale) {
      this.cookieService.put("l", locale);
      location.reload();
    }
  }
}
