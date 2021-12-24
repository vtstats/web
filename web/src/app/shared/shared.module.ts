import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";

import { ColoredNumberDirective } from "./directives/colored-number.directive";
import { HoldGestureDirective } from "./directives/hold-gesture.directive";

import { DistancePipe } from "./pipes/distance.pipe";
import { DurationPipe } from "./pipes/duration.pipe";
import { FormatDurationPipe } from "./pipes/format-duration.pipe";
import { FormatISOPipe } from "./pipes/format-iso.pipe";
import { GroupByPipe } from "./pipes/group-by.pipe";
import { NamePipe } from "./pipes/name.pipe";

import { ApiService } from "./services/api.service";
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
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
  ],
  providers: [ApiService, TickService],
})
export class SharedModule {}
