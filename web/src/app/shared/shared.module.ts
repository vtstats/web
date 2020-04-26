import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DistancePipe } from "./distance.pipe";
import { DurationPipe } from "./duration.pipe";
import { FormatPipe } from "./format.pipe";
import { NamePipe } from "./name.pipe";

@NgModule({
  declarations: [DistancePipe, DurationPipe, FormatPipe, NamePipe],
  imports: [CommonModule],
  exports: [DistancePipe, DurationPipe, FormatPipe, NamePipe],
})
export class SharedModule {}
