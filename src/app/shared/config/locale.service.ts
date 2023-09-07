import { registerLocaleData } from "@angular/common";
import { Injectable } from "@angular/core";
import { loadTranslations } from "@angular/localize";
import { Locale } from "date-fns";
import { getLocalStorage } from "src/utils";

const i18nMap = {
  en: () => import("../../../i18n/en"),
  es: () => import("../../../i18n/es"),
  ja: () => import("../../../i18n/ja"),
  ms: () => import("../../../i18n/ms"),
  zh: () => import("../../../i18n/zh"),
};

@Injectable({ providedIn: "root" })
export class LocaleService {
  dateFns: Locale;

  async initialize(localeId: string) {
    const i18n = await i18nMap[localeId]();

    registerLocaleData(i18n.locale, localeId);

    loadTranslations(i18n.translations);

    this.dateFns = i18n.dateFnsLocale;
  }

  readonly supportedLanguages = ["en", "es", "ja", "ms", "zh"];

  getLocaleId() {
    const lang = getLocalStorage("lang", window.navigator.language.slice(0, 2));

    // fallback to default language
    if (!this.supportedLanguages.includes(lang)) {
      return "en";
    }

    return lang;
  }
}
