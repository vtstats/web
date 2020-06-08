import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ColoredNumberDirective } from "./colored-number.directive";
import { LazyLoadDirective } from "./lazy-load.directive";

@NgModule({
  declarations: [ColoredNumberDirective, LazyLoadDirective],
  imports: [CommonModule],
  exports: [ColoredNumberDirective, LazyLoadDirective],
})
export class DirectivesModule {}
