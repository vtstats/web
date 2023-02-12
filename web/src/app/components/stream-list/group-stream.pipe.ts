import { formatDate } from "@angular/common";
import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import {
  isFuture,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { Stream } from "src/app/models";

export type StreamGroup = { name: string | Date; streams: Stream[] };

@Pipe({
  standalone: true,
  name: "groupStreams",
})
export class GroupStreamsPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(items: Stream[], key: "startTime" | "scheduleTime"): StreamGroup[] {
    const groups = [];

    let last: string | undefined;

    for (const item of items) {
      const name = this._getName(item[key]);
      if (last === name) {
        groups[groups.length - 1].streams.push(item);
      } else {
        groups.push({ name, streams: [item] });
      }
      last = name;
    }

    return groups;
  }

  _getName(value: number): string {
    // TODO: support timezone settings

    if (isToday(value)) {
      return $localize`Today`;
    }

    if (isYesterday(value)) {
      return $localize`Yesterday`;
    }

    if (isTomorrow(value)) {
      return $localize`Tomorrow`;
    }

    if (isFuture(value)) {
      if (isThisWeek(value)) {
        return $localize`This week`;
      }

      if (isThisMonth(value)) {
        return $localize`This month`;
      }

      if (isThisYear(value)) {
        return $localize`This year`;
      }

      return $localize`Future`;
    }

    if (isThisYear(value)) {
      return formatDate(value, "MM/dd", this.locale);
    }

    return formatDate(value, "yyyy/MM/dd", this.locale);
  }
}
