import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { ENABLE_DARK_MODE } from './app/services/config'
import { environment } from "./environments/environment";

if (localStorage.getItem(ENABLE_DARK_MODE) !== null) {
  document.body.classList.add("dark");
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
