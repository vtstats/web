import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";

import { DateSelect } from "../date-select/date-select";
import { VTuberSelect } from "../vtuber-select/vtuber-select";

@Component({
  selector: "hs-filter-group",
  templateUrl: "filter-group.html",
})
export class FilterGroup {
  @ViewChild(DateSelect) dateSelect: DateSelect;
  @Input() displayDateRange: boolean = true;
  @Output() dateRangeChanged = new EventEmitter<[Date, Date]>();

  @ViewChild(VTuberSelect) vtuberSelect: VTuberSelect;
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
