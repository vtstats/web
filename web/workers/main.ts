// environment variables
declare const B2_URL: string;

import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleEvent(event: FetchEvent): Promise<Response> {
  const request = event.request;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api")) {
    const response = await fetch(request);

    return hanldeEtag(request, response);
  }

  if (url.pathname.startsWith("/thumbnail")) {
    const response = await getAssetFromB2(url.pathname.slice(10));

    return hanldeEtag(request, response);
  }

  return getAssetFromKV(event).catch(() =>
    getAssetFromKV(event, {
      mapRequestToAsset: (req) => new Request(`${url.origin}/index.html`, req),
    })
  );
}

async function getAssetFromB2(key: string): Promise<Response> {
  const response = await fetch(`${B2_URL}${key}`, {
    cf: { cacheEverything: true, cacheTtl: 60 },
  });

  const headers = new Headers(response.headers);

  if (!response.ok) {
    headers.set("cache-control", "max-age=0, no-cache, no-store");

    return new Response(null, {
      status: 404,
      headers,
      statusText: "Not Found",
    });
  }

  headers.set("cache-control", "public, max-age=3600");
  if (headers.has("x-bz-upload-timestamp")) {
    headers.set("etag", headers.get("x-bz-upload-timestamp") as string);
  }
  headers.delete("x-bz-content-sha1");
  headers.delete("x-bz-file-id");
  headers.delete("x-bz-file-name");
  headers.delete("x-bz-upload-timestamp");

  return new Response(response.body, { headers });
}

function hanldeEtag(request: Request, response: Response): Response {
  if (
    response.headers.has("etag") &&
    request.headers.has("if-none-match") &&
    request.headers.get("if-none-match") === response.headers.get("etag")
  ) {
    return new Response(null, {
      status: 304,
      headers: response.headers,
      statusText: "Not Modified",
    });
  }

  return response;
}
