import { Routes } from "@angular/router";

import { NotFound } from "../pages/not-found/not-found";
import StreamsDetail from "../pages/streams-detail/streams-detail";
import VtubersDetail from "../pages/vtubers-detail/vtubers-detail";

import { Platform } from "../models";
import { streamCanActive, streamResolve } from "./stream";
import { vtuberCanActive, vtuberResolve } from "./vtuber";

export default [
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
