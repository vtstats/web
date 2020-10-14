import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleEvent(event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api")) {
    return fetch(event.request);
  }

  return getAssetFromKV(event).catch(() =>
    getAssetFromKV(event, {
      mapRequestToAsset: (req) => new Request(`${url.origin}/index.html`, req),
    })
  );
}
