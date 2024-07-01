import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./paths.mjs";

const commitSha = execSync("git rev-parse --short HEAD", {
  encoding: "utf-8",
}).trim();
const angularJsonFile = join(root, "angular.json");

const angularJson = JSON.parse(readFileSync(angularJsonFile, "utf-8"));
angularJson.projects.vts.architect.build.configurations.production.define[
  "process.env.COMMIT_SHA"
] = JSON.stringify(commitSha);

writeFileSync(angularJsonFile, JSON.stringify(angularJson));

const indexFile = join(root, "src/index.html");

const index = readFileSync(indexFile, "utf-8").replace(
  `</body>`,
  `<script defer src='https://static.cloudflareinsights.com/beacon.min.js' ` +
    `data-cf-beacon='{"token": "a55155db07a5447e8f640e515c67b6e3"}'></script></body>`,
);

writeFileSync(indexFile, index);
