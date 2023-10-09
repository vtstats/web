import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from "@angular/common";
import {
  APP_ID,
  LOCALE_ID,
  enableProdMode,
  importProvidersFrom,
} from "@angular/core";
import { loadTranslations } from "@angular/localize";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {
  bootstrapApplication,
  provideClientHydration,
  withNoHttpTransferCache,
} from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  TitleStrategy,
  provideRouter,
  withInMemoryScrolling,
} from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import * as Sentry from "@sentry/browser";
import { QueryClient, hydrate } from "@tanstack/query-core";
import qs from "query-string";

import { AppComponent } from "./app/app.component";
import { getRoutes } from "./app/routes";
import { catalogQuery, exchangeRatesQuery } from "./app/shared/api/entrypoint";
import { DATE_FNS_LOCALE, QUERY_CLIENT } from "./app/shared/tokens";
import { VtsTitleStrategy } from "./app/shared/title";
import { environment } from "./environments/environment";
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

const migrate = () => {
  const parsed = qs.parseUrl(window.location.toString(), {
    arrayFormat: "comma",
  });
  if (parsed.url.endsWith("/hls-migrate")) {
    localStorage.setItem("vts:vtuberSelected", JSON.stringify(parsed.query.v));

    localStorage.setItem("vts:nameSetting", JSON.stringify(parsed.query.n));

    if (typeof parsed.query.l === "string") {
      localStorage.setItem("lang", parsed.query.l);
    }

    if (typeof parsed.query.tz === "string") {
      localStorage.setItem("timezone", parsed.query.tz);
    }

    localStorage.setItem("vts:themeSetting", JSON.stringify(parsed.query.t));

    localStorage.setItem("vts:currencySetting", JSON.stringify(parsed.query.c));

    window.location.replace("/");
  }
};

const queryClientFactory = async (): Promise<QueryClient> => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        onError: console.error,
      },
    },
  });

  const el = document.getElementById("__QUERY_CLIENT_DEHYDRATED_STATE__");

  if (el) {
    const dehydratedState = JSON.parse(el.textContent!);
    hydrate(client, dehydratedState);
  }

  await client.fetchQuery(exchangeRatesQuery);
  await client.fetchQuery(catalogQuery);

  return client;
};

const i18nMap = {
  en: () => import("./i18n/en"),
  es: () => import("./i18n/es"),
  ja: () => import("./i18n/ja"),
  ms: () => import("./i18n/ms"),
  zh: () => import("./i18n/zh"),
};

const localeIdFactory = (): string => {
  const supportedLanguages = ["en", "es", "ja", "ms", "zh"];

  const lang = getLocalStorage("lang", window.navigator.language.slice(0, 2));

  // fallback to default language
  if (!supportedLanguages.includes(lang)) {
    return "en";
  }

  return lang;
};

const bootstrap = async () => {
  const localeId = localeIdFactory();

  const i18n = await i18nMap[localeId]();
  registerLocaleData(i18n.locale, localeId);
  loadTranslations(i18n.translations);

  const queryClient = await queryClientFactory();

  return bootstrapApplication(AppComponent, {
    providers: [
      { provide: APP_ID, useValue: "vts" },
      { provide: LOCALE_ID, useValue: localeId },
      {
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: { timezone: getLocalStorage("timezone", null) },
      },
      { provide: TitleStrategy, useClass: VtsTitleStrategy },
      { provide: QUERY_CLIENT, useValue: queryClient },
      { provide: DATE_FNS_LOCALE, useValue: i18n.dateFnsLocale },
      provideRouter(
        getRoutes(),
        withInMemoryScrolling({ scrollPositionRestoration: "enabled" })
      ),
      provideServiceWorker("ngsw-worker.js", {
        enabled: environment.production,
        registrationStrategy: "registerImmediately",
      }),
      provideClientHydration(withNoHttpTransferCache()),
      provideAnimations(),
      importProvidersFrom(MatSnackBarModule),
    ],
  });
};

migrate();

if (document.readyState === "complete") {
  bootstrap().catch(console.error);
} else {
  document.addEventListener("DOMContentLoaded", bootstrap);
}
