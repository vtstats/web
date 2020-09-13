import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { TransferHttpCacheModule } from "@nguniversal/common";
import { CookieModule } from "ngx-cookie";
import { EllipsisModule } from "ngx-ellipsis";

import { environment } from "../environments/environment";

import providers from "src/i18n";

import { AppComponent } from "./app.component";
import { BilibiliChannelComponent } from "./bilibili-channel";
import { HeaderComponent } from "./header";
import { SharedModule } from "./shared";
import { SettingsComponent } from "./settings";
import { SidenavComponent } from "./sidenav";
import { YoutubeChannelComponent } from "./youtube-channel";
import { YoutubeScheduleStreamComponent } from "./youtube-schedule-stream";
import { YoutubeStreamComponent } from "./youtube-stream";
import { VTubersDetailComponent } from "./vtubers-detail";
import { StreamsDetailComponent } from "./streams-detail";
import { NotFoundComponent } from "./not-found";
import { AppShellComponent } from "./app-shell";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "shell", component: AppShellComponent },
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
  declarations: [
    AppComponent,
    BilibiliChannelComponent,
    HeaderComponent,
    SettingsComponent,
    SidenavComponent,
    YoutubeChannelComponent,
    YoutubeScheduleStreamComponent,
    YoutubeStreamComponent,
    StreamsDetailComponent,
    VTubersDetailComponent,
    NotFoundComponent,
    AppShellComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: "holostats" }),
    TransferHttpCacheModule,
    HttpClientModule,
    CookieModule.forRoot(),
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatTreeModule,
    SharedModule,
    EllipsisModule,
    RouterModule.forRoot(ROUTES, { scrollPositionRestoration: "enabled" }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers,
  bootstrap: [AppComponent],
})
export class AppModule {}
