import { Route } from "@angular/router";

import { Licenses } from "../about/licenses/licenses";
import { NgswSettings } from "../about/miscellaneous/ngsw-settings/ngsw-settings";
import { PrivacyPolicy } from "../about/miscellaneous/privacy-policy/privacy-policy";
import { Settings } from "./settings";

export const getRoutes = (): Route[] => [
  {
    path: "",
    title: $localize`:@@settings:Settings`,
    component: Settings,
    pathMatch: "full",
  },
  {
    path: "ngsw",
    title: "Service worker",
    component: NgswSettings,
  },
  {
    path: "licenses",
    title: "Third Party Licenses",
    component: Licenses,
  },
  {
    path: "privacy",
    title: "Privacy policy",
    component: PrivacyPolicy,
  },
];
