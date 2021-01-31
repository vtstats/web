import { HttpClientModule } from "@angular/common/http";
import { NgModule, LOCALE_ID } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";

import { environment } from "../environments/environment";

import { getLocaleId } from "../i18n/locale";

import { LayoutModule } from "./layout";
import {
  PagesModule,
  BilibiliChannelComponent,
  SettingsComponent,
  YoutubeChannelComponent,
  YoutubeScheduleStreamComponent,
  YoutubeStreamComponent,
  VTubersDetailComponent,
  StreamsDetailComponent,
  NotFoundComponent,
} from "./pages";

import { AppComponent } from "./app.component";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "youtube-channel", component: YoutubeChannelComponent },
  { path: "bilibili-channel", component: BilibiliChannelComponent },
  {
    path: "youtube-schedule-stream",
    component: YoutubeScheduleStreamComponent,
  },
  { path: "youtube-stream", component: YoutubeStreamComponent },
  { path: "settings", component: SettingsComponent },
  { path: "stream/:id", component: StreamsDetailComponent },
  { path: "vtuber/:id", component: VTubersDetailComponent },
  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "stream", redirectTo: "/youtube-stream", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
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
