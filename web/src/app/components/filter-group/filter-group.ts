import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";

import { DateFilter } from "../date-filter/date-filter";
import { VTuberFilter } from "../vtuber-filter/vtuber-filter";

@Component({
  selector: "hs-filter-group",
  templateUrl: "filter-group.html",
})
export class FilterGroup {
  @ViewChild(DateFilter) dateSelect: DateFilter;
  @Input() displayDateRange: boolean = true;
  @Output() dateRangeChanged = new EventEmitter<[Date, Date]>();

  @ViewChild(VTuberFilter) vtuberSelect: VTuberFilter;
  @Input() displayVTuber: boolean = true;
  @Output() vtuberChanged = new EventEmitter<Set<string>>();

  @Output() clear = new EventEmitter();

  displayClear = false;

  onClear() {
    this.displayClear = false;
    this.dateSelect && this.dateSelect.clear();
    this.vtuberSelect && this.vtuberSelect.clear();
    this.clear.emit();
  }
}
