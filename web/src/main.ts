import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { environment } from "./environments/environment";

import { init } from "./i18n";
import { AppModule } from "./app/app.module";

if (environment.production) {
  enableProdMode();
}

const lang =
  window.localStorage.getItem("lang") || window.navigator.language.slice(0, 2);

init()
  .then(() => platformBrowserDynamic().bootstrapModule(AppModule))
  .catch((err) => console.error(err));
