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
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTreeModule
} from "@angular/material";
import { ServiceWorkerModule } from "@angular/service-worker";
import { RouterModule, Routes } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from "./app.component";
import { AreaChartComponent } from "./area-chart";
import { FooterComponent } from "./footer";
import { NavbarComponent } from "./navbar";
import { SettingsComponent } from "./settings";
import { StreamsDetailComponent } from "./streams-detail";
import { StreamsListComponent } from "./streams-list";
import { VTubersDetailComponent } from "./vtubers-detail";
import { VTubersListComponent } from "./vtubers-list";
import { ColoredNumberDirective, LazyLoadDirective } from "./directives";
import { DurationPipe, DistancePipe, ParseISOPipe } from "./pipes";

import { environment } from "../environments/environment";

const ROUTES: Routes = [
  { path: "", redirectTo: "/vtuber", pathMatch: "full" },
  { path: "settings", component: SettingsComponent },
  { path: "stream", component: StreamsListComponent },
  { path: "stream/:id", component: StreamsDetailComponent },
  { path: "vtuber", component: VTubersListComponent },
  { path: "vtuber/:id", component: VTubersDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AreaChartComponent,
    FooterComponent,
    NavbarComponent,
    SettingsComponent,
    StreamsDetailComponent,
    StreamsListComponent,
    VTubersDetailComponent,
    VTubersListComponent,
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
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
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
