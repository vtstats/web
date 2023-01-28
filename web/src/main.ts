import {
  DATE_PIPE_DEFAULT_TIMEZONE,
  registerLocaleData,
} from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import { enableProdMode, importProvidersFrom, LOCALE_ID } from "@angular/core";
import { loadTranslations } from "@angular/localize";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import * as Sentry from "@sentry/browser";

import { environment } from "./environments/environment";

import { AppComponent } from "./app/app.component";
import { ROUTES } from "./app/routes";
import { DATE_FNS_LOCALE, getLang } from "./i18n";
import { getLocalStorage } from "./utils";

if (environment.production) {
  enableProdMode();

  Sentry.init({
    dsn: "https://64c25f8bfc9e45ffa532ed5ab1dc989f@o488466.ingest.sentry.io/6113288",
    // use global variable here, so we can get the same content hash
    release: (window as any).cfPagesCommitSha,
    environment: (window as any).cfPagesBranch,
  });
}

const bootstrap = async () => {
  const lang = getLang();

  const i18n = await import(
    /* webpackChunkName: "i18n/[request]" */
    /* webpackExclude: /(index|\.d)\.ts$/ */
    `./i18n/${lang}`
  );

  // locale
  registerLocaleData(i18n.locale, lang);

  loadTranslations(i18n.translations);

  const appRef = await bootstrapApplication(AppComponent, {
    providers: [
      { provide: DATE_FNS_LOCALE, useValue: i18n.dateFnsLocale },
      { provide: LOCALE_ID, useValue: lang },
      {
        provide: DATE_PIPE_DEFAULT_TIMEZONE,
        useValue: getLocalStorage("timezone"),
      },
      provideRouter(
        ROUTES,
        withInMemoryScrolling({ scrollPositionRestoration: "enabled" })
      ),
      provideHttpClient(),
      provideAnimations(),
      importProvidersFrom(
        ServiceWorkerModule.register("ngsw-worker.js", {
          enabled: environment.production,
          registrationStrategy: "registerImmediately",
        })
      ),
      importProvidersFrom(MatSnackBarModule),
    ],
  });
};

if (document.readyState === "complete") {
  bootstrap().catch(console.error);
} else {
  document.addEventListener("DOMContentLoaded", bootstrap);
}
