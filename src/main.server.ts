import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { provideServerRendering } from "@angular/platform-server";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { AppComponent } from "./app/app.component";
import routes from "./app/routes/index.server";
import { environment } from "./environments/environment";
import { providers } from "./providers";

if (environment.production) {
  enableProdMode();
}

export const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      ...providers,
      provideNoopAnimations(),
      provideServerRendering(),
      provideRouter(routes, withComponentInputBinding()),
    ],
  });
