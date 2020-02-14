import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Routes } from "@angular/router";

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
    PipesModule,
    FlexLayoutModule
  ],
  providers: [VtubersDetailResolver]
})
export class VtubersDetailModule {}
