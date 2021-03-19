import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, EventEmitter, Output } from "@angular/core";

import {
  DateRange,
  MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
} from "@angular/material/datepicker";
import { isAfter, isSameDay, isThisYear } from "date-fns";
import format from "date-fns/format";

@Component({
  selector: "hs-date-select",
  templateUrl: "./date-select.html",
  styleUrls: ["./date-select.scss"],
  providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER],
  animations: [
    trigger("transform", [
      state(
        "void",
        style({
          opacity: 0,
          transform: "scale(0.8)",
        })
      ),
      transition(
        "void => enter",
        animate(
          "120ms cubic-bezier(0, 0, 0.2, 1)",
          style({
            opacity: 1,
            transform: "scale(1)",
          })
        )
      ),
      transition(
        "* => void",
        animate("100ms 25ms linear", style({ opacity: 0 }))
      ),
    ]),
  ],
})
export class DateSelect {
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
      return "Select Date";
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
