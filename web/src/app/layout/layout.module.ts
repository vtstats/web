import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTooltipModule } from "@angular/material/tooltip";

import { SharedModule } from "../shared";

import { Header } from "./header";
import { Sidenav } from "./sidenav";

@NgModule({
  declarations: [Header, Sidenav],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatTooltipModule,
    SharedModule,
  ],
  exports: [Header, Sidenav],
})
export class LayoutModule {}
