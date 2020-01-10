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
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from "./app.component";
import { AreaChartComponent } from "./area-chart";
import { BilibiliChannelComponent } from "./bilibili-channel";
import { NavbarComponent } from "./navbar";
import { SettingsComponent } from "./settings";
import { SidenavComponent } from "./sidenav";
import { StreamsDetailComponent } from "./streams-detail";
import { StreamsListComponent } from "./streams-list";
import { VTubersDetailComponent } from "./vtubers-detail";
import { YoutubeChannelComponent } from "./youtube-channel";
import { ColoredNumberDirective, LazyLoadDirective } from "./directives";
import { DurationPipe, DistancePipe, ParseISOPipe } from "./pipes";

import { environment } from "../environments/environment";

const ROUTES: Routes = [
  { path: "", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "youtube-channel", component: YoutubeChannelComponent },
  { path: "bilibili-channel", component: BilibiliChannelComponent },
  { path: "youtube-stream", component: StreamsListComponent },
  { path: "settings", component: SettingsComponent },
  { path: "stream/:id", component: StreamsDetailComponent },
  { path: "vtuber/:id", component: VTubersDetailComponent },
  // redirect old link
  { path: "vtuber", redirectTo: "/youtube-channel", pathMatch: "full" },
  { path: "stream", redirectTo: "/youtube-stream", pathMatch: "full" }
];

@NgModule({
  declarations: [
    AppComponent,
    AreaChartComponent,
    BilibiliChannelComponent,
    NavbarComponent,
    SettingsComponent,
    SidenavComponent,
    StreamsDetailComponent,
    StreamsListComponent,
    VTubersDetailComponent,
    YoutubeChannelComponent,
    ColoredNumberDirective,
    LazyLoadDirective,
    DistancePipe,
    DurationPipe,
    ParseISOPipe
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
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
    NgxChartsModule,
    NgxSpinnerModule,
    RouterModule.forRoot(ROUTES),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
