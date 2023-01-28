import Critters from "critters";
import fs from "fs/promises";

import server from "./dist/server/main.js";

const { CF_PAGES_BRANCH = "", CF_PAGES_COMMIT_SHA = "" } = process.env;

{
  const path = "dist/browser/index.html";
  const document = await fs.readFile("dist/browser/index.html", "utf-8");

  let html = await server.renderAppShell(document);

  // inline critical css
  html = await new Critters({
    mergeStylesheets: false,
    external: true,
    path: "dist/browser",
  }).process(html);

  // set environment variables
  html = html
    .replace("BUILD_TIME", new Date().toISOString())
    .replace("CF_PAGES_BRANCH", CF_PAGES_BRANCH)
    .replace("CF_PAGES_COMMIT_SHA", CF_PAGES_COMMIT_SHA);

  html = html.replace('<body class="dark">', "<body>");

  await fs.writeFile(path, html);
}

{
  const path = "dist/browser/ngsw.json";
  let json = JSON.parse(await fs.readFile(path, "utf-8"));

  // set timestamp to 0 to generate identical manifest.json file cross builds
  json.timestamp = 0;

  await fs.writeFile(path, JSON.stringify(json, null, 2));
}
