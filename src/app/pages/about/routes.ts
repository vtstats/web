import { Route } from "@angular/router";

import { Licenses } from "./licenses/licenses";
import { NgswSettings } from "./ngsw-settings/ngsw-settings";
import { PrivacyPolicy } from "./privacy-policy/privacy-policy";
import { AboutPage } from "./about";

export default [
  {
    path: "",
    title: "about",
    component: AboutPage,
    pathMatch: "full",
  },
  {
    path: "ngsw",
    title: "service worker",
    component: NgswSettings,
  },
  {
    path: "licenses",
    title: "third party licenses",
    component: Licenses,
  },
  {
    path: "privacy",
    title: "privacy policy",
    component: PrivacyPolicy,
  },
] satisfies Route[];
