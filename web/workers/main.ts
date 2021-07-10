// environment variables
declare const S3_URL: string;
declare const S3_ACCESS_KEY_ID: string;
declare const S3_SECRET_ACCESS_KEY: string;

import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  service: "s3",
});

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
    const response = await fetch(
      "https://holoapi.poi.cat" + url.pathname,
      event.request
    );

    return hanldeEtag(request, response);
  }

  // prevent objects listing
  if (url.pathname.startsWith("/thumbnail/") && url.pathname.endsWith(".jpg")) {
    const response = await getAssetFromS3(url.pathname.slice(10));

    return hanldeEtag(request, response);
  }

  return getAssetFromKV(event).catch(() =>
    getAssetFromKV(event, {
      mapRequestToAsset: (req) => new Request(`${url.origin}/index.html`, req),
    })
  );
}

async function getAssetFromS3(key: string): Promise<Response> {
  const response = await aws.fetch(`${S3_URL}${key}`, {
    cf: { cacheEverything: true, cacheTtl: 31536000 /* 1y */ },
  });

  const headers = new Headers(response.headers);

  headers.delete("x-amz-id-2");
  headers.delete("x-amz-request-id");

  if (!response.ok) {
    headers.set("cache-control", "max-age=0, no-cache, no-store");

    return new Response(null, {
      status: 404,
      headers,
      statusText: "Not Found",
    });
  }

  headers.set("cache-control", "public, max-age=31536000, immutable");

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
