import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { VTubersDetailComponent } from "./vtubers-detail.component";
import { ChartsModule } from "../charts";
import { PipesModule } from "../pipes";

const ROUTES: Routes = [
  {
    path: ":id",
    component: VTubersDetailComponent
  }
];

@NgModule({
  declarations: [VTubersDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ChartsModule,
    PipesModule
  ]
})
export class VtubersDetailModule {}
