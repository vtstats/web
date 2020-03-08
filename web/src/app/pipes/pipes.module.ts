import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DistancePipe } from "./distance.pipe";
import { DurationPipe } from "./duration.pipe";
import { ParseISOPipe } from "./parse-iso.pipe";
import { VTubersPipe } from "./vtubers.pipe";

@NgModule({
  declarations: [DistancePipe, DurationPipe, ParseISOPipe, VTubersPipe],
  imports: [CommonModule],
  exports: [DistancePipe, DurationPipe, ParseISOPipe, VTubersPipe]
})
export class PipesModule {}
