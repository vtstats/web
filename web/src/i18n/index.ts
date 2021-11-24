import { InjectionToken } from "@angular/core";
import type { Locale } from "date-fns";

const supportedLanguages = ["en", "ms", "zh", "es"];

export const DATE_FNS_LOCALE = new InjectionToken<Locale>("DATE_FNS_LOCALE");

export const translate = (id: string): string => {
  const temp = `:@@${id}:`;

  const array: any = [temp];
  array.raw = [temp];

  // HACK
  return $localize(array);
};

export const getLang = (): string => {
  let lang =
    window.localStorage.getItem("lang") ||
    window.navigator.language.slice(0, 2);

  // fallback to default language
  if (!supportedLanguages.includes(lang)) {
    lang = "en";
  }

  return lang;
};
