/***************************************************************************************************
 * Initialize the server environment - for example, adding DOM built-in types to the global scope.
 *
 * NOTE:
 * This import must come before any imports (direct or transitive) that rely on DOM built-ins being
 * available, such as `@angular/elements`.
 */
import "@angular/platform-server/init";

/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import "@angular/localize/init";

import "zone.js";

import { enableProdMode, importProvidersFrom } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { renderApplication } from "@angular/platform-server";

import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

export const renderAppShell = (document: string): Promise<string> =>
  renderApplication(AppComponent, {
    appId: "hls",
    url: "/",
    document,
    providers: [importProvidersFrom(MatSnackBarModule)],
  });
