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
import { ColoredNumberDirective } from "./directives";
import { SubsDetailComponent } from "./subs-detail";
import { ListDialogComponent } from "./list-dialog";
import { SettingsSheetComponent } from "./settings-sheet";
import { SubsComponent } from "./subs";
import { NavbarComponent } from "./navbar";
import { environment } from "../environments/environment";
import { StreamsComponent } from "./streams";
import { StreamDetailComponent } from "./stream-detail/stream-detail.component";

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
    ColoredNumberDirective,
    SubsDetailComponent,
    ListDialogComponent,
    SettingsSheetComponent,
    SubsComponent,
    NavbarComponent,
    StreamsComponent,
    StreamDetailComponent
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
