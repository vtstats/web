import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { PrivacyPolicy } from "./privacy-policy";

@NgModule({
  imports: [
    CommonModule,
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
