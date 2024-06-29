import { renderApplication } from "@angular/platform-server";
import type {
  Element,
  ExecutionContext,
  HTMLRewriterElementContentHandlers,
  ServiceWorkerGlobalScope,
} from "@cloudflare/workers-types";
import { QueryClient, dehydrate } from "@tanstack/query-core";

import * as api from "./src/app/shared/api/entrypoint";
import {
  CATALOG_CHANNELS,
  CATALOG_GROUPS,
  CATALOG_VTUBERS,
  DATE_FNS_LOCALE,
  EXCHANGE_RATES,
} from "./src/app/shared/tokens";
import * as i18n from "./src/i18n/en";
import { bootstrap } from "./src/main.server";

declare const self: ServiceWorkerGlobalScope;

interface Env {
  ASSETS: { fetch: typeof fetch };
}

async function workerFetchHandler(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  const cache = self.caches.default;
  let res = await cache.match(req.url);

  if (res) return res;

  const url = new URL(req.url);

  const document = await env.ASSETS.fetch(new Request(new URL("/", url))).then(
    (res) => res.text(),
  );

  const queryClient = new QueryClient();

  const catalog = await queryClient.fetchQuery(api.catalogQuery);

  const html = await renderApplication(bootstrap, {
    document,
    url: url.pathname,
    platformProviders: [
      { provide: DATE_FNS_LOCALE, useValue: i18n.dateFnsLocale },
      { provide: CATALOG_CHANNELS, useValue: catalog.channels },
      { provide: CATALOG_GROUPS, useValue: catalog.groups },
      { provide: CATALOG_VTUBERS, useValue: catalog.vtubers },
      { provide: EXCHANGE_RATES, useValue: {} },
    ],
  });

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
}

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

    const state = dehydrate(this.client, {
      shouldDehydrateMutation: () => false,
    });

    const str = JSON.stringify(state);

    return str.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
  }

  element(element: Element) {
    element.onEndTag((tag) => {
      tag.before(
        '<script id="__QUERY_CLIENT_DEHYDRATED_STATE__" type="application/json">' +
          this.escapeState() +
          "</script>",
        { html: true },
      );
    });
  }
}

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) =>
    (globalThis as any)["__zone_symbol__Promise"].resolve(
      workerFetchHandler(request, env, ctx),
    ),
};
