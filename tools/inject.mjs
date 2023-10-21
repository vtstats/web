import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./paths.mjs";

const commit = execSync("git rev-parse --short HEAD", {
  encoding: "utf-8",
}).trim();

const branch = execSync("git branch --show-current", {
  encoding: "utf-8",
}).trim();

const indexFile = join(root, "src/index.html");

const index = readFileSync(indexFile, "utf-8")
  .replace("BUILD_TIME", new Date().toISOString())
  .replace("GIT_BRANCH", branch)
  .replace("GIT_COMMIT_SHA", commit)
  .replace(
    `</body>`,
    `<script defer src='https://static.cloudflareinsights.com/beacon.min.js' ` +
      `data-cf-beacon='{"token": "a55155db07a5447e8f640e515c67b6e3"}'></script></body>`
  );

writeFileSync(indexFile, index);
