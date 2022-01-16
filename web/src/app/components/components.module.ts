import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PortalModule } from "@angular/cdk/portal";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { OverlayModule } from "@angular/cdk/overlay";

import { LoadingSpinner } from "./loading-spinner/loading-spinner";
import { StreamItem, StreamItemShimmer } from "./stream-item/stream-item";
import { StreamGroup } from "./stream-group/stream-group";
import { StreamsList } from "./stream-list/stream-list";
import { SubMenu, SubMenuTitle, SubMenuExtra } from "./sub-menu/sub-menu";
import { DateFilter } from "./date-filter/date-filter";
import { VTuberFilter } from "./vtuber-filter/vtuber-filter";
import { FilterGroup } from "./filter-group/filter-group";
import { Helmet } from "./helmet/helmet.component";

import { SharedModule } from "src/app/shared";

@NgModule({
  declarations: [
    LoadingSpinner,
    StreamGroup,
    StreamItem,
    StreamItemShimmer,
    StreamsList,
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    DateFilter,
    VTuberFilter,
    FilterGroup,
    Helmet,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortalModule,
    OverlayModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatSnackBarModule,
    SharedModule,
  ],
  exports: [
    LoadingSpinner,
    StreamGroup,
    StreamItem,
    StreamItemShimmer,
    StreamsList,
    SubMenu,
    SubMenuTitle,
    SubMenuExtra,
    FilterGroup,
    Helmet,
  ],
})
export class ComponentsModule {}
