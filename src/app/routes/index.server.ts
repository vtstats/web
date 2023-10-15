import { Route, Routes } from "@angular/router";

import aboutRoutes from "../pages/about/routes";
import ChannelStats from "../pages/channel-stats/channel-stats";
import { NotFound } from "../pages/not-found/not-found";
import Settings from "../pages/settings/settings";
import { ShareTarget } from "../pages/share-target/share-target";
import StreamsDetail from "../pages/streams-detail/streams-detail";
import StreamsList from "../pages/streams-list/streams-list";
import VtubersDetail from "../pages/vtubers-detail/vtubers-detail";

import { ChannelStatsKind, Platform } from "../models";
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
    children: aboutRoutes,
  },
  {
    path: "channel",
    redirectTo: "/channel/subscribers",
    pathMatch: "full",
  },
  {
    path: "channel/revenue",
    title: "channel revenue",
    component: ChannelStats,
    data: { kind: ChannelStatsKind.REVENUE },
  },
  {
    path: "channel/views",
    title: "channel views",
    component: ChannelStats,
    data: { kind: ChannelStatsKind.VIEW },
  },
  {
    path: "channel/subscribers",
    title: "channel subscribers",
    component: ChannelStats,
    data: { kind: ChannelStatsKind.SUBSCRIBER },
  },
  {
    path: "settings",
    title: "settings",
    component: Settings,
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
    component: StreamsList,
  },
  {
    path: "stream/scheduled",
    title: `schedule stream`,
    data: { status: "scheduled" },
    component: StreamsList,
  },
  {
    path: "stream/:id",
    component: StreamsDetail,
    resolve: { stream: streamResolve },
    canActivate: [streamCanActive],
  },
  {
    path: "youtube-stream/:id",
    component: StreamsDetail,
    data: { platform: Platform.YOUTUBE },
    resolve: { stream: streamResolve },
    canActivate: [streamCanActive],
  },
  {
    path: "twitch-stream/:id",
    component: StreamsDetail,
    data: { platform: Platform.TWITCH },
    resolve: { stream: streamResolve },
    canActivate: [streamCanActive],
  },
  {
    path: "vtuber/:vtuberId",
    component: VtubersDetail,
    resolve: { resolved: vtuberResolve },
    canActivate: [vtuberCanActive],
  },
  // not found
  { path: "**", title: "not found", component: NotFound },
] satisfies Routes;
