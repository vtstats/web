import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { environment } from "./environments/environment";

import { initLocale } from "./i18n/locale";
import { initTranslation } from "./i18n/translations";
import { AppModule } from "./app/app.module";

if (environment.production) {
  enableProdMode();
}

const lang =
  window.localStorage.getItem("lang") || window.navigator.language.slice(0, 2);

initLocale(lang);
initTranslation(lang);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
