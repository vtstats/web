import { registerLocaleData } from "@angular/common";
import { Injectable } from "@angular/core";
import { loadTranslations } from "@angular/localize";
import { Locale } from "date-fns";
import { getLocalStorage } from "src/utils";

@Injectable({ providedIn: "root" })
export class LocaleService {
  dateFns: Locale;

  async initialize(localeId: string) {
    const i18n = await import(
      /* webpackChunkName: "i18n/[request]" */
      /* webpackExclude: /(index|\.d)\.ts$/ */
      `../../../i18n/${localeId}`
    );

    registerLocaleData(i18n.locale, localeId);

    loadTranslations(i18n.translations);

    this.dateFns = i18n.dateFnsLocale;
  }

  readonly supportedLanguages = ["en", "es", "ja", "ms", "zh"];

  getLocaleId() {
    let lang = getLocalStorage("lang") || window.navigator.language.slice(0, 2);

    // fallback to default language
    if (!this.supportedLanguages.includes(lang)) {
      lang = "en";
    }

    return lang;
  }
}
