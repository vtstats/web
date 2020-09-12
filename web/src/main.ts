import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { ENABLE_DARK_MODE } from "./app/services/config";
import { environment } from "./environments/environment";

import { getBrowserLocale, getLocaleProviders } from "src/i18n";

import { AppModule } from "./app/app.module";

if (window.localStorage.getItem(ENABLE_DARK_MODE) !== null) {
  document.body.classList.add("dark");
}

if (environment.production) {
  enableProdMode();
}

document.addEventListener("DOMContentLoaded", () => {
  platformBrowserDynamic(getLocaleProviders(getBrowserLocale()))
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
});
