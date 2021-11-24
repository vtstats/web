import { Component, EventEmitter, Output } from "@angular/core";

import {
  DateRange,
  MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
} from "@angular/material/datepicker";
import { isAfter, isSameDay, isThisYear, format } from "date-fns";

import animations from "./date-filter-animations";

@Component({
  selector: "hs-date-filter",
  templateUrl: "./date-filter.html",
  styleUrls: ["./date-filter.scss"],
  providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER],
  animations,
})
export class DateFilter {
  @Output() selectedChange = new EventEmitter<[Date, Date]>();

  _min = new Date(2016, 10, 29);
  _max = new Date();

  _isOpen = false;

  _range = new DateRange(null, null);

  _lastRange = this._range;

  public clear() {
    this._range = new DateRange(null, null);
  }

  onChange(date: Date) {
    if (this._range.start && !this._range.end) {
      this._lastRange = this._range;
      if (isAfter(this._range.start, date)) {
        this._range = new DateRange(date, this._range.start);
      } else {
        this._range = new DateRange(this._range.start, date);
      }
      this.selectedChange.next([this._range.start, this._range.end]);
      this._isOpen = false;
    } else {
      this._lastRange = this._range;
      this._range = new DateRange(date, null);
    }
  }

  getBtnText() {
    if (!this._range.start && !this._range.end) {
      return $localize`:@@selectDate:`;
    }

    const formStr =
      this._range.start && !isThisYear(this._range.start)
        ? "yyyy/MM/dd"
        : "MM/dd";

    if (!this._range.end) {
      return `${format(this._range.start, formStr)} -`;
    }

    if (!this._range.start) {
      return `- ${format(this._range.end, formStr)}`;
    }

    if (isSameDay(this._range.start, this._range.end)) {
      return format(this._range.start, formStr);
    }

    return `${format(this._range.start, formStr)} - ${format(
      this._range.end,
      formStr
    )}`;
  }

  onClickOutside(event: MouseEvent) {
    event.stopPropagation();
    this._isOpen = false;
    if (this._range.start && !this._range.end) {
      this._range = this._lastRange;
    }
  }
}
