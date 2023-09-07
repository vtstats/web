const Critters = require("critters");
const fs = require("node:fs/promises");
const { execSync } = require("node:child_process");

const main = async () => {
  execSync("./node_modules/.bin/ng run vts:server:production", {
    stdio: "inherit",
  });

  execSync("./node_modules/.bin/ng run vts:build:production", {
    stdio: "inherit",
  });

  const path = "dist/browser/index.html";
  const document = await fs.readFile(path, "utf-8");

  const server = require("./dist/server/main");

  let html = await server.renderAppShell(document);

  // inline critical css
  // https://github.com/angular/angular-cli/blob/8da926966e9f414ceecf60b89acd475ce1b55fc5/packages/angular_devkit/build_angular/src/utils/index-file/inline-critical-css.ts#L41
  html = await new Critters({
    path: "dist/browser",
    pruneSource: false,
    reduceInlineStyles: false,
    mergeStylesheets: false,
    preload: "media",
    noscriptFallback: true,
    inlineFonts: true,
  }).process(html);

  html = html.replace('<body class="dark">', "<body>");

  await fs.writeFile(path, html);
};

main().catch(console.error);
