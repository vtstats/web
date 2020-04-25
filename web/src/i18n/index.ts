import { loadTranslations } from "@angular/localize";
import { registerLocaleData } from "@angular/common";
import localeEn from "@angular/common/locales/en";
import localeZh from "@angular/common/locales/zh-Hant";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/zh-tw";

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
      dayjs.locale("zh-tw");
      break;
    }
    case "en":
    default: {
      loadTranslations(translationsEn);
      registerLocaleData(localeEn, "en");
      dayjs.locale("en");
      break;
    }
  }
}

load();
