import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from "@angular/common";
import { LOCALE_ID, enableProdMode } from "@angular/core";
import { loadTranslations } from "@angular/localize";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from "@angular/router";
import * as Sentry from "@sentry/browser";
import { QueryClient, hydrate } from "@tanstack/query-core";
import qs from "query-string";

import { AppComponent } from "./app/app.component";
import routes from "./app/routes";
import { catalogQuery, exchangeRatesQuery } from "./app/shared/api/entrypoint";
import {
  CATALOG_CHANNELS,
  CATALOG_GROUPS,
  CATALOG_VTUBERS,
  DATE_FNS_LOCALE,
  EXCHANGE_RATES,
  QUERY_CLIENT,
} from "./app/shared/tokens";
import { environment } from "./environments/environment";
import { providers } from "./providers";
import { getLocalStorage } from "./utils";

if (environment.production) {
  enableProdMode();

  Sentry.init({
    dsn: "https://64c25f8bfc9e45ffa532ed5ab1dc989f@o488466.ingest.sentry.io/6113288",
    // use global variable here, so we can get the same content hash
    release: (<any>window).gitCommitSha,
    environment: (<any>window).gitBranch,
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

const createQueryClient = (): QueryClient => {
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

  return client;
};

const i18nMap = {
  en: () => import("./i18n/en"),
  es: () => import("./i18n/es"),
  ja: () => import("./i18n/ja"),
  ms: () => import("./i18n/ms"),
  zh: () => import("./i18n/zh"),
};

const localeIdFactory = (): keyof typeof i18nMap => {
  const lang = getLocalStorage("lang", window.navigator.language.slice(0, 2));

  // fallback to default language
  if (lang in i18nMap) {
    return lang as any;
  }

  return "en";
};

const bootstrap = async () => {
  const localeId = localeIdFactory();

  const i18n = await i18nMap[localeId]();
  registerLocaleData(i18n.locale, localeId);
  loadTranslations(i18n.translations);

  const queryClient = createQueryClient();

  const exchangeRates = await queryClient.fetchQuery(exchangeRatesQuery);
  const catalog = await queryClient.fetchQuery(catalogQuery);

  queryClient.mount();

  return bootstrapApplication(AppComponent, {
    providers: [
      ...providers,
      { provide: LOCALE_ID, useValue: localeId },
      {
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: { timezone: getLocalStorage("timezone", null) },
      },
      { provide: QUERY_CLIENT, useValue: queryClient },
      { provide: EXCHANGE_RATES, useValue: exchangeRates },
      { provide: CATALOG_CHANNELS, useValue: catalog.channels },
      { provide: CATALOG_GROUPS, useValue: catalog.groups },
      { provide: CATALOG_VTUBERS, useValue: catalog.vtubers },
      { provide: DATE_FNS_LOCALE, useValue: i18n.dateFnsLocale },
      provideRouter(
        routes,
        withInMemoryScrolling({ scrollPositionRestoration: "enabled" }),
        withComponentInputBinding(),
        withRouterConfig({ urlUpdateStrategy: "eager" }),
      ),
      provideAnimations(),
    ],
  });
};

migrate();

if (document.readyState === "complete") {
  bootstrap().catch(console.error);
} else {
  document.addEventListener("DOMContentLoaded", bootstrap);
}
