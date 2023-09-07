import { Route } from "@angular/router";

import { Licenses } from "./licenses/licenses";
import { NgswSettings } from "./ngsw-settings/ngsw-settings";
import { PrivacyPolicy } from "./privacy-policy/privacy-policy";
import { AboutPage } from "./about";

export default [
  {
    path: "",
    title: "About",
    component: AboutPage,
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
] satisfies Route[];
