/***************************************************************************************************
 * Initialize the server environment - for example, adding DOM built-in types to the global scope.
 *
 * NOTE:
 * This import must come before any imports (direct or transitive) that rely on DOM built-ins being
 * available, such as `@angular/elements`.
 */
import "@angular/platform-server/init";

/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import "@angular/localize/init";

import "zone.js";

import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import {
  provideServerRendering,
  renderApplication,
} from "@angular/platform-server";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import type {
  Element,
  ExecutionContext,
  HTMLRewriterElementContentHandlers,
  ServiceWorkerGlobalScope,
} from "@cloudflare/workers-types";
import { QueryClient, dehydrate } from "@tanstack/query-core";

import { AppComponent } from "./app/app.component";
import routes from "./app/routes/index.server";
import * as api from "./app/shared/api/entrypoint";
import {
  CATALOG_CHANNELS,
  CATALOG_GROUPS,
  CATALOG_VTUBERS,
  DATE_FNS_LOCALE,
  EXCHANGE_RATES,
  QUERY_CLIENT,
} from "./app/shared/tokens";
import { environment } from "./environments/environment";
import * as i18n from "./i18n/en";
import { providers } from "./providers";

declare const self: ServiceWorkerGlobalScope;

interface Env {
  ASSETS: { fetch: typeof fetch };
}

if (environment.production) {
  enableProdMode();
}

// We attach the Cloudflare `fetch()` handler to the global scope
// so that we can export it when we process the Angular output.
// See tools/bundle.mjs
(<any>globalThis).__workerFetchHandler = async function fetch(
  req: Request,
  env: Env,
  ctx: ExecutionContext
) {
  const cache = self.caches.default;
  let res = await cache.match(req.url);

  if (res) return res;

  const url = new URL(req.url);

  const document = await env.ASSETS.fetch(new Request(new URL("/", url))).then(
    (res) => res.text()
  );

  const queryClient = new QueryClient();

  const catalog = await queryClient.fetchQuery(api.catalogQuery);

  const html = await renderApplication(
    () =>
      bootstrapApplication(AppComponent, {
        providers: [
          ...providers,
          { provide: DATE_FNS_LOCALE, useValue: i18n.dateFnsLocale },
          { provide: QUERY_CLIENT, useValue: queryClient },
          { provide: CATALOG_CHANNELS, useValue: catalog.channels },
          { provide: CATALOG_GROUPS, useValue: catalog.groups },
          { provide: CATALOG_VTUBERS, useValue: catalog.vtubers },
          { provide: EXCHANGE_RATES, useValue: {} },
          provideNoopAnimations(),
          provideServerRendering(),
          provideRouter(routes, withComponentInputBinding()),
        ],
      }),
    { document, url: url.pathname }
  );

  res = new self.Response(html, {
    headers: {
      "cache-control": "max-age=180 s-max-age=180", // 3 minutes
      "content-type": "text/html; charset=utf-8",
      "x-frames-option": "sameorigin",
    },
  });

  res = new self.HTMLRewriter()
    .on("body", new DehydrateQueryClientHandler(queryClient))
    .transform(res);

  ctx.waitUntil(cache.put(req.url, res.clone()));

  return res;
};

class DehydrateQueryClientHandler
  implements HTMLRewriterElementContentHandlers
{
  constructor(private client: QueryClient) {}

  escapeState(): string {
    const ESCAPE_LOOKUP: { [match: string]: string } = {
      "&": "\\u0026",
      ">": "\\u003e",
      "<": "\\u003c",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029",
    };

    const ESCAPE_REGEX = /[&><\u2028\u2029]/g;

    const state = dehydrate(this.client, { dehydrateMutations: false });

    const str = JSON.stringify(state);

    return str.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
  }

  element(element: Element) {
    element.onEndTag((tag) => {
      tag.before(
        '<script id="__QUERY_CLIENT_DEHYDRATED_STATE__" type="application/json">' +
          this.escapeState() +
          "</script>",
        { html: true }
      );
    });
  }
}
