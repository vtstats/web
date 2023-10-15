import { Routes } from "@angular/router";

import { ChannelStatsKind, Platform } from "../models";
import { NotFound } from "../pages/not-found/not-found";
import { ShareTarget } from "../pages/share-target/share-target";
import { streamCanActive, streamResolve } from "./stream";
import { vtuberCanActive, vtuberResolve } from "./vtuber";

export default [
  {
    path: "",
    redirectTo: "/channel/subscribers",
    pathMatch: "full",
  },
  {
    path: "about",
    title: "about",
    loadChildren: () => import("../pages/about/routes"),
  },
  {
    path: "channel",
    redirectTo: "/channel/subscribers",
    pathMatch: "full",
  },
  {
    path: "channel/revenue",
    title: "channel revenue",
    loadComponent: () => import("../pages/channel-stats/channel-stats"),
    data: { kind: ChannelStatsKind.REVENUE },
  },
  {
    path: "channel/views",
    title: "channel views",
    loadComponent: () => import("../pages/channel-stats/channel-stats"),
    data: { kind: ChannelStatsKind.VIEW },
  },
  {
    path: "channel/subscribers",
    title: "channel subscribers",
    loadComponent: () => import("../pages/channel-stats/channel-stats"),
    data: { kind: ChannelStatsKind.SUBSCRIBER },
  },
  {
    path: "settings",
    title: "settings",
    loadComponent: () => import("../pages/settings/settings"),
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
    title: "live stream",
    data: { status: "live|ended" },
    loadComponent: () => import("../pages/streams-list/streams-list"),
  },
  {
    path: "stream/scheduled",
    title: `schedule stream`,
    data: { status: "scheduled" },
    loadComponent: () => import("../pages/streams-list/streams-list"),
  },
  {
    path: "stream/:id",
    loadComponent: () => import("../pages/streams-detail/streams-detail"),
    resolve: { stream: streamResolve },
    canActivate: [streamCanActive],
  },
  {
    path: "youtube-stream/:id",
    loadComponent: () => import("../pages/streams-detail/streams-detail"),
    data: { platform: Platform.YOUTUBE },
    resolve: { stream: streamResolve },
    canActivate: [streamCanActive],
  },
  {
    path: "twitch-stream/:id",
    loadComponent: () => import("../pages/streams-detail/streams-detail"),
    data: { platform: Platform.TWITCH },
    resolve: { stream: streamResolve },
    canActivate: [streamCanActive],
  },
  {
    path: "vtuber/:vtuberId",
    loadComponent: () => import("../pages/vtubers-detail/vtubers-detail"),
    resolve: { resolved: vtuberResolve },
    canActivate: [vtuberCanActive],
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
  { path: "**", title: "not found", component: NotFound },
] satisfies Routes;
