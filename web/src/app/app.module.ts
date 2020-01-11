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
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from "@angular/material";
import { ServiceWorkerModule } from "@angular/service-worker";
import { RouterModule, Routes } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from "./app.component";
import { BilibiliChannelComponent } from "./bilibili-channel";
import { NavbarComponent } from "./navbar";
import { SettingsComponent } from "./settings";
import { SidenavComponent } from "./sidenav";
import { YoutubeStreamComponent } from "./youtube-stream";
import { YoutubeChannelComponent } from "./youtube-channel";
import { DirectivesModule } from "./directives";
import { PipesModule } from "./pipes";

import { environment } from "../environments/environment";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "youtube-channel", component: YoutubeChannelComponent },
  { path: "bilibili-channel", component: BilibiliChannelComponent },
  { path: "youtube-stream", component: YoutubeStreamComponent },
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
    NavbarComponent,
    SettingsComponent,
    SidenavComponent,
    YoutubeStreamComponent,
    YoutubeChannelComponent
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
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    NgxSpinnerModule,
    PipesModule,
    RouterModule.forRoot(ROUTES),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
