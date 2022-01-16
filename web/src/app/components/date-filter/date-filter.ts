import { DATE_PIPE_DEFAULT_TIMEZONE, formatDate } from "@angular/common";
import {
  Component,
  EventEmitter,
  Inject,
  LOCALE_ID,
  Optional,
  Output,
} from "@angular/core";

import {
  DateRange,
  MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
} from "@angular/material/datepicker";
import {
  addMinutes,
  isAfter,
  isSameDay,
  isThisYear,
  lightFormat,
} from "date-fns";

import animations from "./date-filter-animations";

@Component({
  selector: "hls-date-filter",
  templateUrl: "./date-filter.html",
  styleUrls: ["./date-filter.scss"],
  providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER],
  animations,
})
export class DateFilter {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Optional()
    @Inject(DATE_PIPE_DEFAULT_TIMEZONE)
    private defaultTz?: string
  ) {}

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
      this.selectedChange.next([
        // emit date with default timezone if specified
        this.setTimezoneToDefault(this._range.start),
        this.setTimezoneToDefault(this._range.end),
      ]);
      this._isOpen = false;
    } else {
      this._lastRange = this._range;
      this._range = new DateRange(date, null);
    }
  }

  setTimezoneToDefault(date: Date): Date {
    if (!this.defaultTz) return date;

    // https://github.com/angular/angular/blob/d1762c78afdc22974ed755754b08fb57d8732976/packages/common/src/i18n/format_date.ts#L721-L740

    const timezone = this.defaultTz.replace(/:/g, "");

    const requestedTimezoneOffset =
      Date.parse("Jan 01, 1970 00:00:00 " + timezone) / 60000;

    if (isNaN(requestedTimezoneOffset)) return date;

    return addMinutes(date, requestedTimezoneOffset);
  }

  // TODO: use pipe
  get text() {
    if (!this._range.start && !this._range.end) {
      return $localize`:@@selectDate:`;
    }

    const formStr =
      this._range.start && !isThisYear(this._range.start)
        ? "yyyy/MM/dd"
        : "MM/dd";

    if (!this._range.end) {
      return `${lightFormat(this._range.start, formStr)} -`;
    }

    if (!this._range.start) {
      return `- ${lightFormat(this._range.end, formStr)}`;
    }

    if (isSameDay(this._range.start, this._range.end)) {
      return lightFormat(this._range.start, formStr);
    }

    return `${lightFormat(this._range.start, formStr)} - ${lightFormat(
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
