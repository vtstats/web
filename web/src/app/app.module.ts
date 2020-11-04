import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { CookieModule } from "ngx-cookie";

import { environment } from "../environments/environment";

import providers from "src/i18n";
import { ConfigService } from "src/app/shared";

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
  AppShell,
} from "./pages";

import { AppComponent } from "./app.component";

import { ComponentsModule } from "./components/components.module";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "shell", component: AppShell },
  { path: "youtube-channel", component: YoutubeChannel },
  { path: "bilibili-channel", component: BilibiliChannel },
  { path: "youtube-schedule-stream", component: YoutubeScheduleStream },
  { path: "youtube-stream", component: YoutubeStream },
  { path: "settings", component: Settings },
  { path: "stream/:id", component: StreamsDetail },
  { path: "vtuber/:id", component: VTubersDetail },
  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "stream", redirectTo: "/youtube-stream", pathMatch: "full" },
  { path: "**", component: NotFound },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: "holostats" }),
    ComponentsModule,
    HttpClientModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(ROUTES, { scrollPositionRestoration: "enabled" }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    PagesModule,
    MatSidenavModule,
    LayoutModule,
  ],
  providers: [ConfigService, ...providers],
  bootstrap: [AppComponent],
})
export class AppModule {}
