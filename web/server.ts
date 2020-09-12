import "zone.js/dist/zone-node";
import "@angular/localize/init";

import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { createServer } from "http";

import { ɵCommonEngine as CommonEngine } from "@nguniversal/common/engine";

import { AppServerModule } from "./src/main.server";

const engine = new CommonEngine(AppServerModule);

const distFolder = join(__dirname, "../browser");

const document = readFileSync(join(distFolder, "index.html"), {
  encoding: "utf8",
});

const server = createServer((req, res) => {
  const url = req.url;

  if (
    url.endsWith(".js") ||
    url.endsWith(".css") ||
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".map") ||
    url.endsWith(".ico") ||
    url.endsWith(".json") ||
    url.endsWith(".webmanifest")
  ) {
    const filePath = join(distFolder, url);

    if (!existsSync(filePath)) {
      res.writeHead(404);
      return res.end();
    }

    const data = readFileSync(filePath);

    if (url.endsWith(".js")) {
      res.writeHead(200, { "content-type": "application/javascript" });
    } else if (url.endsWith(".css")) {
      res.writeHead(200, { "content-type": "text/css" });
    } else {
      res.writeHead(200);
    }

    return res.end(data);
  }

  console.log("URL: ", url);

  engine
    .render({ url, bootstrap: AppServerModule, document })
    .then((html) => {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(html);
      res.end();
    })
    .catch((err) => {
      console.error(err);

      res.writeHead(200, { "content-type": "text/html" });
      res.write(document);
      res.end();
    });
});

server.listen(7000);
