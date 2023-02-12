import { InjectionToken } from "@angular/core";
import type { Locale } from "date-fns";
import { getLocalStorage } from "src/utils";

const supportedLanguages = ["en", "es", "ja", "ms", "zh"];

export const DATE_FNS_LOCALE = new InjectionToken<Locale>("DATE_FNS_LOCALE");

export const getLang = (): string => {
  let lang = getLocalStorage("lang") || window.navigator.language.slice(0, 2);

  // fallback to default language
  if (!supportedLanguages.includes(lang)) {
    lang = "en";
  }

  return lang;
};
