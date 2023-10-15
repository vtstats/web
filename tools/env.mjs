import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./paths.mjs";

const commit = execSync("git rev-parse --short HEAD", {
  encoding: "utf-8",
}).trim();

const envFile = join(root, "src/environments/environment.prod.ts");

const content = readFileSync(envFile, "utf-8").replace(
  "GIT_COMMIT_SHA",
  commit
);

writeFileSync(envFile, content);
