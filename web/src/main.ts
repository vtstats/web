import { enableProdMode, LOCALE_ID } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { loadTranslations } from "@angular/localize";
import { registerLocaleData } from "@angular/common";
import * as Sentry from "@sentry/browser";

import { environment } from "./environments/environment";

import { DATE_FNS_LOCALE, getLang } from "./i18n";
import { AppModule } from "./app/app.module";

if (environment.production) {
  enableProdMode();

  Sentry.init({
    dsn: "https://64c25f8bfc9e45ffa532ed5ab1dc989f@o488466.ingest.sentry.io/6113288",
    release: environment.commit_sha.slice(0, 7),
  });
}

const lang = getLang();

import(
  /* webpackChunkName: "i18n-[request]" */
  /* webpackExclude: /(index|\.d)\.ts$/ */
  `./i18n/${lang}`
)
  .then((mod) => {
    // locale
    registerLocaleData(mod.locale, lang);

    loadTranslations(mod.translations);

    platformBrowserDynamic([
      { provide: DATE_FNS_LOCALE, useValue: mod.dateFnsLocale },
      { provide: LOCALE_ID, useValue: lang },
    ]).bootstrapModule(AppModule, {
      ngZoneEventCoalescing: true,
    });
  })
  .catch((err) => console.error(err));
