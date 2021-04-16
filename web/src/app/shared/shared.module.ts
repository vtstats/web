import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { EllipsisModule } from "ngx-ellipsis";

import { ColoredNumberDirective } from "./directives/colored-number.directive";

import { DistancePipe } from "./pipes/distance.pipe";
import { DurationPipe, IntervalPipe } from "./pipes/duration.pipe";
import { FormatISOPipe } from "./pipes/format-iso.pipe";
import { GroupByPipe } from "./pipes/group-by.pipe";
import { NamePipe } from "./pipes/name.pipe";

import { ApiService } from "./services/api.service";
import { TickService } from "./services/tick.service";

@NgModule({
  declarations: [
    DistancePipe,
    DurationPipe,
    IntervalPipe,
    FormatISOPipe,
    GroupByPipe,
    NamePipe,
    ColoredNumberDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    EllipsisModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    DistancePipe,
    DurationPipe,
    IntervalPipe,
    FormatISOPipe,
    GroupByPipe,
    NamePipe,
    ColoredNumberDirective,
  ],
  providers: [ApiService, TickService],
})
export class SharedModule {}
