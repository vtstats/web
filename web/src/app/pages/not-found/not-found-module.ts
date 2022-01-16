import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ComponentsModule } from "src/app/components/components.module";

import { NotFound } from "./not-found";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: "",
        component: NotFound,
      },
    ]),
  ],
  exports: [],
  declarations: [NotFound],
  providers: [],
})
export class NotFoundModule {}
