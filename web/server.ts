import "zone.js/dist/zone-node";
import "@angular/localize/init";

import { join } from "path";
import { readFileSync } from "fs";
import * as express from "express";

import { ngExpressEngine } from "@nguniversal/express-engine";

import { AppServerModule } from "./src/main.server";
import { environment } from "./src/environments/environment";

const DIST_DIR = process.env.DIST_DIR || join(__dirname, "../browser");

const DOCUMENT_PATH = process.env.DOCUMENT_PATH || join(DIST_DIR, "index.html");

const document = readFileSync(DOCUMENT_PATH, { encoding: "utf8" });

const app = express();

const render = ngExpressEngine({ bootstrap: AppServerModule });

// only serve static files for testing
if (!environment.production) {
  app.get("*.*", express.static(DIST_DIR));
}

app.get("**", (req, res) => {
  render(DOCUMENT_PATH, { req, res, document }, (err, html) => {
    if (err) {
      console.error(err);

      res.writeHead(200, { "content-type": "text/html" });
      res.write(document);
      res.end();
    } else {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(html);
      res.end();
    }
  });
});

app.listen(7000);
