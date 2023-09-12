import { Route } from "@angular/router";

import Revenue from "./revenue/revenue";
import Views from "./views/views";
import Subscriber from "./subscriber/subscriber";

export default [
  {
    path: "",
    redirectTo: "/channel/subscribers",
    pathMatch: "full",
  },
  {
    path: "revenue",
    title: "channel revenue",
    component: Revenue,
  },
  {
    path: "views",
    title: "channel views",
    component: Views,
  },
  {
    path: "subscribers",
    title: "channel subscribers",
    component: Subscriber,
  },
] satisfies Route[];
