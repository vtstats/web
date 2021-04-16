import { HttpClientModule } from "@angular/common/http";
import { NgModule, LOCALE_ID } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";

import { environment } from "../environments/environment";

import { getLocaleId } from "../i18n";

import { LayoutModule } from "./layout";
import {
  PagesModule,
  Settings,
  YoutubeChannel,
  YoutubeChannelEX,
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
  { path: "youtube-channel-ex", component: YoutubeChannelEX },
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
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { scrollPositionRestoration: "enabled" }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    PagesModule,
    MatSidenavModule,
    LayoutModule,
  ],
  providers: [{ provide: LOCALE_ID, useFactory: getLocaleId }],
  bootstrap: [AppComponent],
})
export class AppModule {}
