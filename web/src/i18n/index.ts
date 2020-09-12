import { LOCALE_ID, InjectionToken, StaticProvider } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import { loadTranslations } from "@angular/localize";
import localeEn from "@angular/common/locales/en";
import localeZh from "@angular/common/locales/zh-Hant";
import { Locale } from "date-fns";
import dateFnsLocaleEn from "date-fns/locale/en-US";
import dateFnsLocaleZh from "date-fns/locale/zh-TW";

import translationsEn from "./translations/en";
import translationsZh from "./translations/zh";

export const DATE_FNS_LOCALE = new InjectionToken<Locale>("date-fns.locale");

export const getBrowserLocale = (): string => {
  const userLocale = localStorage.getItem("holostats:locale");
  const autoLocale = window.navigator.language.slice(0, 2);
  return userLocale || autoLocale;
};

export const getLocaleProviders = (locale: string): StaticProvider[] => {
  let dateFnsLocale: Locale;

  switch (locale) {
    case "zh": {
      loadTranslations(translationsZh);
      registerLocaleData(localeZh, "zh");
      dateFnsLocale = dateFnsLocaleZh;
      break;
    }
    case "en":
    default: {
      loadTranslations(translationsEn);
      registerLocaleData(localeEn, "en");
      dateFnsLocale = dateFnsLocaleEn;
      break;
    }
  }

  return [
    { provide: LOCALE_ID, useValue: locale },
    { provide: DATE_FNS_LOCALE, useValue: dateFnsLocale },
  ];
};
