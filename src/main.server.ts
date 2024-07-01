import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideServerRendering } from "@angular/platform-server";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import {
  QueryClient,
  provideAngularQuery,
} from "@tanstack/angular-query-experimental";

import { AppComponent } from "./app/app.component";
import routes from "./app/routes";
import * as api from "./app/shared/api/entrypoint";
import {
  CATALOG_CHANNELS,
  CATALOG_GROUPS,
  CATALOG_VTUBERS,
  DATE_FNS_LOCALE,
  EXCHANGE_RATES,
} from "./app/shared/tokens";
import { environment } from "./environments/environment";
import * as i18n from "./i18n/en";
import { providers } from "./providers";

if (environment.production) {
  enableProdMode();
}

export const bootstrap = async (queryClient?: QueryClient) => {
  queryClient ||= new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const catalog = await queryClient.fetchQuery(api.catalogQuery);

  return bootstrapApplication(AppComponent, {
    providers: [
      ...providers,
      { provide: DATE_FNS_LOCALE, useValue: i18n.dateFnsLocale },
      { provide: CATALOG_CHANNELS, useValue: catalog.channels },
      { provide: CATALOG_GROUPS, useValue: catalog.groups },
      { provide: CATALOG_VTUBERS, useValue: catalog.vtubers },
      { provide: EXCHANGE_RATES, useValue: {} },
      provideNoopAnimations(),
      provideServerRendering(),
      provideAngularQuery(queryClient),
      provideRouter(routes, withComponentInputBinding()),
    ],
  });
};

export default bootstrap;
