import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { StreamsDetailComponent } from "./streams-detail.component";
import { ChartsModule } from "../charts";
import { PipesModule } from "../pipes";

const ROUTES: Routes = [
  {
    path: ":id",
    component: StreamsDetailComponent
  }
];

@NgModule({
  declarations: [StreamsDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ChartsModule,
    PipesModule
  ]
})
export class StreamsDetailModule {}
