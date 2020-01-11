import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { ChartsModule } from "../charts";
import { PipesModule } from "../pipes";
import { VTubersDetailComponent } from "./vtubers-detail.component";
import { VtubersDetailResolver } from "./vtubers-detail.resolver";

const ROUTES: Routes = [
  {
    path: ":id",
    component: VTubersDetailComponent,
    resolve: {
      data: VtubersDetailResolver
    }
  }
];

@NgModule({
  declarations: [VTubersDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ChartsModule,
    PipesModule
  ],
  providers: [VtubersDetailResolver]
})
export class VtubersDetailModule {}
