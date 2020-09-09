import { loadTranslations } from "@angular/localize";
import { registerLocaleData } from "@angular/common";
import localeEn from "@angular/common/locales/en";
import localeZh from "@angular/common/locales/zh-Hant";

import { translations as translationsEn } from "./en";
import { translations as translationsZh } from "./zh";

function load() {
  const userLocale = localStorage.getItem("holostats:locale");
  const autoLocale = window.navigator.language.slice(0, 2);
  const locale = userLocale || autoLocale;

  switch (locale) {
    case "zh": {
      loadTranslations(translationsZh);
      registerLocaleData(localeZh, "zh");
      break;
    }
    case "en":
    default: {
      loadTranslations(translationsEn);
      registerLocaleData(localeEn, "en");
      break;
    }
  }
}

load();
