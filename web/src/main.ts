import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from "@angular/common";
import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
  LOCALE_ID,
} from "@angular/core";
import { loadTranslations } from "@angular/localize";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  provideRouter,
  TitleStrategy,
  withInMemoryScrolling,
} from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import * as Sentry from "@sentry/browser";

import { environment } from "./environments/environment";

import { AppComponent } from "./app/app.component";
import { getRoutes } from "./app/routes";
import { CurrencyService } from "./app/shared/config/currency.service";
import { HoloStatsTitleStrategy } from "./app/shared/title";
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
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: { timezone: getLocalStorage("timezone") },
      },
      {
        provide: TitleStrategy,
        useClass: HoloStatsTitleStrategy,
      },
      {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [CurrencyService],
        useFactory: (srv: CurrencyService) => () => srv.initialize(),
      },
      provideRouter(
        getRoutes(),
        withInMemoryScrolling({ scrollPositionRestoration: "enabled" })
      ),
      importProvidersFrom(
        ServiceWorkerModule.register("ngsw-worker.js", {
          enabled: environment.production,
          registrationStrategy: "registerImmediately",
        })
      ),
      importProvidersFrom(BrowserModule.withServerTransition({ appId: "hls" })),
      importProvidersFrom(BrowserAnimationsModule),
      importProvidersFrom(MatSnackBarModule),
    ],
  });
};

if (document.readyState === "complete") {
  bootstrap().catch(console.error);
} else {
  document.addEventListener("DOMContentLoaded", bootstrap);
}
