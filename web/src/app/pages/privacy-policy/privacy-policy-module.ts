import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { PrivacyPolicy } from "./privacy-policy";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: "",
        component: PrivacyPolicy,
      },
    ]),
  ],
  declarations: [PrivacyPolicy],
})
export class PrivacyPolicyModule {}
