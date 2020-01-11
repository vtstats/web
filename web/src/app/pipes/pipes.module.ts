import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DistancePipe } from "./distance.pipe";
import { DurationPipe } from "./duration.pipe";
import { ParseISOPipe } from "./parse-iso.pipe";

@NgModule({
  declarations: [DistancePipe, DurationPipe, ParseISOPipe],
  imports: [CommonModule],
  exports: [DistancePipe, DurationPipe, ParseISOPipe]
})
export class PipesModule {}
