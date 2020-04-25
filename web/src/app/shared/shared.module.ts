import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DistancePipe } from "./distance.pipe";
import { DurationPipe } from "./duration.pipe";
import { FormatPipe } from "./format.pipe";
import { VTubersPipe } from "./vtubers.pipe";

@NgModule({
  declarations: [DistancePipe, DurationPipe, FormatPipe, VTubersPipe],
  imports: [CommonModule],
  exports: [DistancePipe, DurationPipe, FormatPipe, VTubersPipe],
})
export class SharedModule {}
