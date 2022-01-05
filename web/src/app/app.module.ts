import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";

import { environment } from "../environments/environment";

import { LayoutModule } from "./layout";
import {
  PagesModule,
  BilibiliChannel,
  Settings,
  YoutubeChannel,
  YoutubeScheduleStream,
  YoutubeStream,
  VTubersDetail,
  StreamsDetail,
  NotFound,
} from "./pages";

import { AppComponent } from "./app.component";

import { ComponentsModule } from "./components/components.module";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "youtube-channel", component: YoutubeChannel },
  { path: "bilibili-channel", component: BilibiliChannel },
  { path: "youtube-schedule-stream", component: YoutubeScheduleStream },
  { path: "youtube-stream", component: YoutubeStream },
  { path: "settings", component: Settings },
  { path: "stream/:id", component: StreamsDetail },
  { path: "vtuber/:id", component: VTubersDetail },
  {
    path: "privacy-policy",
    loadChildren: () =>
      import("./pages/privacy-policy/privacy-policy-module").then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "stream", redirectTo: "/youtube-stream", pathMatch: "full" },
  { path: "**", component: NotFound },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { scrollPositionRestoration: "enabled" }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production && environment.branch === "production",
    }),
    PagesModule,
    MatSidenavModule,
    LayoutModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
