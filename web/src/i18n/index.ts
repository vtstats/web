import { registerLocaleData } from "@angular/common";
import { loadTranslations } from "@angular/localize";
import type { Locale } from "date-fns";
import type { Translations } from "./data";

let locale: string;
let dateFnsLocale: Locale;
let translations: Translations;

export const translate = (key: string): string => translations[key];

export const getLocaleId = (): string => locale;

export const getDateFnsLocale = (): Locale => dateFnsLocale;

export function init(): Promise<void> {
  const lang =
    window.localStorage.getItem("lang") ||
    window.navigator.language.slice(0, 2);

  locale = lang;

  return import(
    /* webpackChunkName: "i18n-[request]" */
    /* webpackExclude: /\.d\.ts$/ */
    `./${lang}`
  ).then((mod) => {
    // locale
    registerLocaleData(mod.locale, lang);

    // date-fns locale
    dateFnsLocale = mod.dateFnsLocale;

    // translations
    translations = mod.translations;
    loadTranslations(mod.translations);
  });
}
