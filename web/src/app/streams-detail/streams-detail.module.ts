import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Routes } from "@angular/router";

import { ChartsModule } from "../charts";
import { PipesModule } from "../pipes";
import { StreamsDetailComponent } from "./streams-detail.component";
import { StreamsDetailResolver } from "./streams-detail.resolver";

const ROUTES: Routes = [
  {
    path: ":id",
    component: StreamsDetailComponent,
    resolve: {
      data: StreamsDetailResolver
    }
  }
];

@NgModule({
  declarations: [StreamsDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ChartsModule,
    PipesModule,
    FlexLayoutModule
  ],
  providers: [StreamsDetailResolver]
})
export class StreamsDetailModule {}
