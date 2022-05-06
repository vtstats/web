import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";

import { LayoutModule } from "./layout";

import { AppComponent } from "./app.component";

import { ComponentsModule } from "./components/components.module";
import { ShareTarget } from "./pages/share-target/share-target";
import { environment } from "../environments/environment";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "share-target", component: ShareTarget },
  {
    path: "youtube-channel",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/channels-list" */
        "./pages/channels-list/channels-list-module"
      ).then((m) => m.ChannelsListModule),
  },
  {
    path: "bilibili-channel",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/channels-list" */
        "./pages/channels-list/channels-list-module"
      ).then((m) => m.ChannelsListModule),
  },
  {
    path: "youtube-stream",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/streams-list" */
        "./pages/streams-list/streams-list-module"
      ).then((m) => m.StreamsListModule),
  },
  {
    path: "youtube-schedule-stream",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/streams-list" */
        "./pages/streams-list/streams-list-module"
      ).then((m) => m.StreamsListModule),
  },
  {
    path: "settings",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/settings" */
        "./pages/settings/settings-module"
      ).then((m) => m.SettingsModule),
  },
  {
    path: "stream/:id",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/streams-detail" */
        "./pages/streams-detail/streams-detail-module"
      ).then((m) => m.StreamsDetailModule),
  },
  {
    path: "vtuber/:id",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/vtubers-detail" */
        "./pages/vtubers-detail/vtubers-detail-module"
      ).then((m) => m.VTubersDetailModule),
  },
  {
    path: "privacy-policy",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/privacy-policy" */
        "./pages/privacy-policy/privacy-policy-module"
      ).then((m) => m.PrivacyPolicyModule),
  },
  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "stream", redirectTo: "/youtube-stream", pathMatch: "full" },
  {
    path: "**",
    loadChildren: () =>
      import(
        /* webpackChunkName: "pages/not-found" */
        "./pages/not-found/not-found-module"
      ).then((m) => m.NotFoundModule),
  },
];

@NgModule({
  declarations: [AppComponent, ShareTarget],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: "holostats" }),
    ComponentsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { scrollPositionRestoration: "enabled" }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      registrationStrategy: "registerImmediately",
    }),
    MatSidenavModule,
    LayoutModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
