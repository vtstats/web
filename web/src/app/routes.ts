import { InjectionToken } from "@angular/core";
import { Routes } from "@angular/router";
import { subHours } from "date-fns";

import { NotFound } from "./pages/not-found/not-found";
import { ShareTarget } from "./pages/share-target/share-target";
import type { StreamsListPageData } from "./pages/streams-list/streams-list";

const ChannelList = () =>
  import(
    /* webpackChunkName: "pages/channels-list" */ "./pages/channels-list/channels-list"
  ).then((m) => m.ChannelList);
const StreamsList = () =>
  import(
    /* webpackChunkName: "pages/streams-list" */ "./pages/streams-list/streams-list"
  ).then((m) => m.StreamsList);
const StreamsDetail = () =>
  import(
    /* webpackChunkName: "pages/streams-detail" */ "./pages/streams-detail/streams-detail"
  ).then((m) => m.StreamsDetail);
const VTubersDetail = () =>
  import(
    /* webpackChunkName: "pages/vtubers-detail" */ "./pages/vtubers-detail/vtubers-detail"
  ).then((m) => m.VTubersDetail);
const Settings = () =>
  import(
    /* webpackChunkName: "pages/settings" */ "./pages/settings/routes"
  ).then((m) => m.ROUTES);

export const TITLE = new InjectionToken<string>("HLS_TITLE");

export const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "share-target", component: ShareTarget },
  {
    path: "youtube-channel",
    providers: [
      {
        provide: TITLE,
        useFactory: () => $localize`:@@youtubeChannel:YouTube Channel`,
      },
    ],
    data: { platform: "youtube" },
    loadComponent: ChannelList,
  },
  {
    path: "bilibili-channel",
    providers: [
      {
        provide: TITLE,
        useFactory: () => $localize`:@@bilibiliChannel:Bilibili Channel`,
      },
    ],
    data: { platform: "bilibili" },
    loadComponent: ChannelList,
  },
  {
    path: "youtube-stream",
    providers: [
      {
        provide: TITLE,
        useFactory: () => $localize`:@@youtubeStream:YouTube Stream`,
      },
    ],
    data: <StreamsListPageData>{
      status: ["live", "ended"],
      orderBy: ["start_time", "desc"],
    },
    loadComponent: StreamsList,
  },
  {
    path: "youtube-schedule-stream",
    providers: [
      {
        provide: TITLE,
        useFactory: () => $localize`:@@youtubeSchedule:YouTube Schedule Stream`,
      },
    ],
    data: <StreamsListPageData>{
      status: ["scheduled"],
      orderBy: ["schedule_time", "asc"],
      startAt: Number(subHours(Date.now(), 6)),
    },
    loadComponent: StreamsList,
  },
  {
    path: "settings",
    loadChildren: Settings,
  },
  {
    path: "stream/:id",
    loadComponent: StreamsDetail,
  },
  {
    path: "vtuber/:id",
    loadComponent: VTubersDetail,
  },
  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "stream", redirectTo: "/youtube-stream", pathMatch: "full" },
  { path: "**", component: NotFound },
];
