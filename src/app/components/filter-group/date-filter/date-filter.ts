import {
  ConnectedPosition,
  Overlay,
  OverlayModule,
} from "@angular/cdk/overlay";
import { formatDate } from "@angular/common";
import {
  Component,
  EventEmitter,
  LOCALE_ID,
  Output,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import {
  DateRange,
  MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { endOfDay, isAfter, startOfDay } from "date-fns";

import animations from "../_animations";

@Component({
  standalone: true,
  imports: [
    OverlayModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: "vts-date-filter",
  templateUrl: "./date-filter.html",
  styleUrls: ["./date-filter.scss"],
  providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER],
  animations,
  encapsulation: ViewEncapsulation.None,
})
export class DateFilter {
  closeScrollStrategy = inject(Overlay).scrollStrategies.close();
  positions: ConnectedPosition[] = [
    {
      originX: "start",
      originY: "bottom",
      overlayX: "start",
      overlayY: "top",
      offsetY: 10,
    },
    {
      originX: "start",
      originY: "top",
      overlayX: "start",
      overlayY: "bottom",
      offsetY: -10,
    },
  ];

  locale = inject(LOCALE_ID);

  @Output() selectedChange = new EventEmitter<[Date, Date] | null>();

  minDate = new Date(2016, 10, 29);
  maxDate = new Date();

  open = signal(false);
  range = signal(new DateRange<Date>(null, null));

  lastRange = new DateRange<Date>(null, null);

  text = computed(() => {
    const { start, end } = this.range();

    if (!start && !end) {
      return "Date";
    }

    let text = "";
    if (start) {
      text += formatDate(start, "MM/dd", this.locale);
    }
    text += "-";
    if (end) {
      text += formatDate(end, "MM/dd", this.locale);
    }
    return text;
  });

  selected = computed(() => {
    const { start, end } = this.range();
    return Boolean(start && end);
  });

  onChange(date: Date) {
    const range = this.range();

    if (range.start && !range.end) {
      let start: Date;
      let end: Date;

      // TODO: consider time zone offset
      if (isAfter(range.start, date)) {
        start = startOfDay(date);
        end = endOfDay(range.start);
      } else {
        start = startOfDay(range.start);
        end = endOfDay(date);
      }

      this.range.set(new DateRange(start, end));
      this.selectedChange.next([start, end]);
      this.open.set(false);
    } else {
      this.lastRange = range;
      this.range.set(new DateRange(date, null));
    }
  }

  toggle() {
    this.open.update((i) => !i);
  }

  clear() {
    this.range.set(new DateRange<Date>(null, null));
    this.open.set(false);
    this.selectedChange.emit(null);
  }

  onClickOutside(event: MouseEvent) {
    event.stopPropagation();
    this.open.set(false);
    this.range.set(this.lastRange);
  }
}
