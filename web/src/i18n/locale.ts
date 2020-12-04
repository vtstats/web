import localeEn from "@angular/common/locales/en";
import localeZh from "@angular/common/locales/zh-Hant";
import localeMs from "@angular/common/locales/ms";
import { registerLocaleData } from "@angular/common";
import { Locale } from "date-fns";
import dateFnsLocaleEn from "date-fns/locale/en-US";
import dateFnsLocaleZh from "date-fns/locale/zh-TW";
import dateFnsLocaleMs from "date-fns/locale/ms";

let locale: string;
let dateFnsLocale: Locale;

export function initLocale(lang: string) {
  switch (lang) {
    case "zh": {
      registerLocaleData(localeZh, "zh");
      locale = "zh";
      dateFnsLocale = dateFnsLocaleZh;
      break;
    }
    case "ms": {
      registerLocaleData(localeMs, "ms");
      locale = "ms";
      dateFnsLocale = dateFnsLocaleMs;
      break;
    }
    case "en":
    default: {
      registerLocaleData(localeEn, "en");
      locale = "en";
      dateFnsLocale = dateFnsLocaleEn;
      break;
    }
  }
}

export function getLocaleId(): string {
  return locale;
}

export function getDateFnsLocale(): Locale {
  return dateFnsLocale;
}
