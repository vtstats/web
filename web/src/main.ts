import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";
import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
  LOCALE_ID,
} from "@angular/core";
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
import { LocaleService } from "./app/shared/config/locale.service";
import { VTuberService } from "./app/shared/config/vtuber.service";
import { HoloStatsTitleStrategy } from "./app/shared/title";
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

const bootstrap = () => {
  return bootstrapApplication(AppComponent, {
    providers: [
      {
        provide: LOCALE_ID,
        deps: [LocaleService],
        useFactory: (srv: LocaleService) => srv.getLocaleId(),
      },
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
        deps: [LOCALE_ID, LocaleService],
        useFactory: (id: string, srv: LocaleService) => () =>
          srv.initialize(id),
      },
      {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [CurrencyService],
        useFactory: (srv: CurrencyService) => () => srv.initialize(),
      },
      {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [VTuberService],
        useFactory: (srv: VTuberService) => () => srv.initialize(),
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
