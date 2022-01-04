import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { ColoredNumberDirective } from "./directives/colored-number.directive";
import { HoldGestureDirective } from "./directives/hold-gesture.directive";
import { TooltipDirective } from "./directives/tooltip.directive";

import { DistancePipe } from "./pipes/distance.pipe";
import { DurationPipe } from "./pipes/duration.pipe";
import { FormatDurationPipe } from "./pipes/format-duration.pipe";
import { FormatISOPipe } from "./pipes/format-iso.pipe";
import { GroupByPipe } from "./pipes/group-by.pipe";
import { NamePipe } from "./pipes/name.pipe";

import { ApiService } from "./services/api.service";
import { GoogleApiService } from "./services/gapi.service";
import { TickService } from "./services/tick.service";

@NgModule({
  declarations: [
    DistancePipe,
    DurationPipe,
    FormatISOPipe,
    FormatDurationPipe,
    GroupByPipe,
    NamePipe,
    ColoredNumberDirective,
    HoldGestureDirective,
    TooltipDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  exports: [
    DistancePipe,
    DurationPipe,
    FormatISOPipe,
    FormatDurationPipe,
    GroupByPipe,
    NamePipe,
    ColoredNumberDirective,
    HoldGestureDirective,
    TooltipDirective,
  ],
  providers: [ApiService, GoogleApiService, TickService],
})
export class SharedModule {}
