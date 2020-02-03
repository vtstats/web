import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";

import { environment } from "src/environments/environment";

import { AppComponent } from "./app.component";
import {
  BilibiliChannelComponent,
  BilibiliChannelResolver
} from "./bilibili-channel";
import { DirectivesModule } from "./directives";
import { HeaderComponent } from "./header";
import { PipesModule } from "./pipes";
import { SettingsComponent } from "./settings";
import { SidenavComponent } from "./sidenav";
import {
  YoutubeChannelComponent,
  YoutubeChannelResolver
} from "./youtube-channel";
import {
  YoutubeScheduleStreamComponent,
  YoutubeSchduleStreamResolver
} from "./youtube-schedule-stream";
import {
  YoutubeStreamComponent,
  YoutubeStreamResolver
} from "./youtube-stream";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  {
    path: "youtube-channel",
    component: YoutubeChannelComponent,
    resolve: {
      data: YoutubeChannelResolver
    }
  },
  {
    path: "bilibili-channel",
    component: BilibiliChannelComponent,
    resolve: {
      data: BilibiliChannelResolver
    }
  },
  {
    path: "youtube-schedule-stream",
    component: YoutubeScheduleStreamComponent,
    resolve: {
      data: YoutubeSchduleStreamResolver
    }
  },
  {
    path: "youtube-stream",
    component: YoutubeStreamComponent,
    resolve: {
      data: YoutubeStreamResolver
    }
  },
  { path: "settings", component: SettingsComponent },
  {
    path: "stream",
    loadChildren: () =>
      import("./streams-detail/streams-detail.module").then(
        mod => mod.StreamsDetailModule
      )
  },
  {
    path: "vtuber",
    loadChildren: () =>
      import("./vtubers-detail/vtubers-detail.module").then(
        mod => mod.VtubersDetailModule
      )
  },
  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "stream", redirectTo: "/youtube-stream", pathMatch: "full" }
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
    YoutubeStreamComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DirectivesModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatTreeModule,
    PipesModule,
    RouterModule.forRoot(ROUTES),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [
    BilibiliChannelResolver,
    YoutubeChannelResolver,
    YoutubeStreamResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
