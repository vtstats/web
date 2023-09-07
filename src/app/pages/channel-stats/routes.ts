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
    title: "Revenue",
    component: Revenue,
  },
  {
    path: "views",
    title: "views",
    component: Views,
  },
  {
    path: "subscribers",
    title: "Subscribers",
    component: Subscriber,
  },
] satisfies Route[];
