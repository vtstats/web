import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import {
  MatBadgeModule,
  MatBottomSheetModule,
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTreeModule
} from "@angular/material";
import { ServiceWorkerModule } from "@angular/service-worker";
import { RouterModule, Routes } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { AppComponent } from "./app.component";
import { AreaChartComponent } from "./area-chart";
import { ColoredNumberDirective } from "./directives";
import { ListDialogComponent } from "./list-dialog";
import { NavbarComponent } from "./navbar";
import { SettingsSheetComponent } from "./settings-sheet";
import { StreamDetailComponent } from "./stream-detail";
import { StreamsComponent } from "./streams";
import { SubsComponent } from "./subs";
import { SubsDetailComponent } from "./subs-detail";

import { environment } from "../environments/environment";

const ROUTES: Routes = [
  { path: "", redirectTo: "/subs", pathMatch: "full" },
  { path: "subs", component: SubsComponent },
  { path: "subs/:id", component: SubsDetailComponent },
  { path: "stream", component: StreamsComponent },
  { path: "stream/:id", component: StreamDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AreaChartComponent,
    ColoredNumberDirective,
    ListDialogComponent,
    NavbarComponent,
    SettingsSheetComponent,
    StreamDetailComponent,
    StreamsComponent,
    SubsComponent,
    SubsDetailComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatBadgeModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTreeModule,
    NgxChartsModule,
    RouterModule.forRoot(ROUTES),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  entryComponents: [ListDialogComponent, SettingsSheetComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
