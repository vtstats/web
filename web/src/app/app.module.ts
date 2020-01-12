import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";
import { ServiceWorkerModule } from "@angular/service-worker";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import {
  BilibiliChannelComponent,
  BilibiliChannelResolver
} from "./bilibili-channel";
import { HeaderComponent } from "./header";
import { SettingsComponent } from "./settings";
import { SidenavComponent } from "./sidenav";
import {
  YoutubeStreamComponent,
  YoutubeStreamResolver
} from "./youtube-stream";
import {
  YoutubeChannelComponent,
  YoutubeChannelResolver
} from "./youtube-channel";
import { DirectivesModule } from "./directives";
import { PipesModule } from "./pipes";

import { environment } from "src/environments/environment";

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
    MatSlideToggleModule,
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
