import {
  LOCALE_ID,
  InjectionToken,
  StaticProvider,
  PLATFORM_ID,
} from "@angular/core";
import { registerLocaleData, isPlatformBrowser } from "@angular/common";
import { loadTranslations } from "@angular/localize";
import localeEn from "@angular/common/locales/en";
import localeZh from "@angular/common/locales/zh-Hant";
import localeMs from "@angular/common/locales/ms";
import { Locale } from "date-fns";
import dateFnsLocaleEn from "date-fns/locale/en-US";
import dateFnsLocaleZh from "date-fns/locale/zh-TW";
import dateFnsLocaleMs from "date-fns/locale/ms";

import { ConfigService } from "../app/shared/services/config.service";

import translationsEn from "./translations/en";
import translationsMs from "./translations/ms";
import translationsZh from "./translations/zh";
import { LOCAL_NAMES, localNamesFactory } from "./names";

export const DATE_FNS_LOCALE = new InjectionToken<Locale>("date-fns.locale");

const localeIdFactory = (config: ConfigService, platform: Object): string => {
  const userLocale = config.getLocale();
  const autoLocale = isPlatformBrowser(platform)
    ? window.navigator.language.slice(0, 2)
    : undefined;

  switch (userLocale || autoLocale) {
    case "zh": {
      loadTranslations(translationsZh);
      registerLocaleData(localeZh, "zh");
      return "zh";
    }
    case "ms": {
      loadTranslations(translationsMs);
      registerLocaleData(localeMs, "ms");
      return "ms";
    }
    case "en":
    default: {
      loadTranslations(translationsEn);
      registerLocaleData(localeEn, "en");
      return "en";
    }
  }
};

const dateFnsLocaleFactory = (localeId: string): Locale => {
  switch (localeId) {
    case "zh": {
      return dateFnsLocaleZh;
    }
    case "ms": {
      return dateFnsLocaleMs;
    }
    case "en":
    default: {
      return dateFnsLocaleEn;
    }
  }
};

const providers: StaticProvider[] = [
  {
    provide: LOCALE_ID,
    useFactory: localeIdFactory,
    deps: [ConfigService, PLATFORM_ID],
  },
  {
    provide: DATE_FNS_LOCALE,
    useFactory: dateFnsLocaleFactory,
    deps: [LOCALE_ID],
  },
  { provide: LOCAL_NAMES, useFactory: localNamesFactory, deps: [LOCALE_ID] },
];

export default providers;
