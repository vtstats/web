import { Route } from "@angular/router";

import { Licenses } from "./miscellaneous/licenses/licenses";
import { NgswSettings } from "./miscellaneous/ngsw-settings/ngsw-settings";
import { PrivacyPolicy } from "./miscellaneous/privacy-policy/privacy-policy";
import { Settings } from "./settings";

export const ROUTES: Route[] = [
  {
    path: "",
    component: Settings,
    pathMatch: "full",
  },
  {
    path: "ngsw",
    component: NgswSettings,
  },
  {
    path: "licenses",
    component: Licenses,
  },
  {
    path: "privacy",
    component: PrivacyPolicy,
  },
];
