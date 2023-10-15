import { APP_ID, importProvidersFrom } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {
  provideClientHydration,
  withNoHttpTransferCache,
} from "@angular/platform-browser";
import { TitleStrategy } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";

import { VtsTitleStrategy } from "./app/shared/title";
import { environment } from "./environments/environment";

export const providers = [
  { provide: APP_ID, useValue: "vts" },
  { provide: TitleStrategy, useClass: VtsTitleStrategy },
  importProvidersFrom(MatSnackBarModule),
  provideClientHydration(withNoHttpTransferCache()),
  provideServiceWorker("ngsw-worker.js", {
    enabled: environment.production,
    registrationStrategy: "registerImmediately",
  }),
];
