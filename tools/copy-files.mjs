// Copy the files over so that they can be uploaded by the pages publish command.
import fs from "node:fs";
import { join } from "node:path";
import { client, cloudflare, ssr, worker, dist } from "./paths.mjs";

fs.cpSync(client, cloudflare, { recursive: true });
fs.cpSync(ssr, worker, { recursive: true });

fs.renameSync(join(worker, "server.mjs"), join(worker, "index.js"));

fs.cpSync(
  join(dist, "3rdpartylicenses.txt"),
  join(cloudflare, "3rdpartylicenses.txt"),
);
