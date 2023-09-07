import { Routes } from "@angular/router";

import { NotFound } from "./pages/not-found/not-found";
import { ShareTarget } from "./pages/share-target/share-target";

import "./pages/channel-stats/channel-stats";

export const getRoutes = (): Routes => [
  {
    path: "",
    redirectTo: "/channel/subscribers",
    pathMatch: "full",
  },
  {
    path: "about",
    loadChildren: () => import("./pages/about/routes"),
  },
  {
    path: "channel",
    loadChildren: () => import("./pages/channel-stats/routes"),
  },
  {
    path: "settings",
    title: "Settings",
    loadComponent: () => import("./pages/settings/settings"),
  },
  {
    path: "share-target",
    component: ShareTarget,
  },
  {
    path: "stream",
    redirectTo: "/stream/live",
    pathMatch: "full",
  },
  {
    path: "stream/live",
    title: $localize`:@@youtubeStream:YouTube Stream`,
    data: { status: "live|ended" },
    loadComponent: () => import("./pages/streams-list/streams-list"),
  },
  {
    path: "stream/scheduled",
    title: $localize`:@@youtubeSchedule:YouTube Schedule Stream`,
    data: { status: "scheduled" },
    loadComponent: () => import("./pages/streams-list/streams-list"),
  },
  {
    path: "stream/:streamId",
    loadComponent: () => import("./pages/streams-detail/streams-detail"),
  },
  {
    path: "vtuber/:vtuberId",
    loadComponent: () => import("./pages/vtubers-detail/vtubers-detail"),
  },

  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "settings/ngsw", redirectTo: "/about/ngsw", pathMatch: "full" },
  {
    path: "settings/licenses",
    redirectTo: "/about/licenses",
    pathMatch: "full",
  },
  { path: "settings/privacy", redirectTo: "/about/privacy", pathMatch: "full" },
  {
    path: "youtube-channel",
    redirectTo: "/channels/subscribers",
    pathMatch: "full",
  },
  {
    path: "youtube-channel",
    redirectTo: "/channels/subscribers",
    pathMatch: "full",
  },
  {
    path: "youtube-stream",
    redirectTo: "/stream/started",
    pathMatch: "full",
  },
  {
    path: "youtube-schedule-stream",
    redirectTo: "/stream/scheduled",
    pathMatch: "full",
  },

  // not found
  { path: "**", title: "Not Found", component: NotFound },
];
