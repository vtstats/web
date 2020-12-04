import { loadTranslations } from "@angular/localize";

import translationsEn from "./en";
import translationsMs from "./ms";
import translationsZh from "./zh";
import { Translations } from "./data";

let translations: Translations;

export function initTranslation(lang: string) {
  switch (lang) {
    case "zh": {
      loadTranslations(translationsZh);
      translations = translationsZh;
      break;
    }
    case "ms": {
      loadTranslations(translationsMs);
      translations = translationsMs;
      break;
    }
    case "en":
    default: {
      loadTranslations(translationsEn);
      translations = translationsEn;
      break;
    }
  }
}

export function translate(key: string): string {
  return translations[key];
}
