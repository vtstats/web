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
import { Stream, StreamStatus } from "src/app/models";

export type StreamGroup = { name: string | Date; streams: Stream[] };

@Pipe({
  standalone: true,
  name: "groupStreams",
})
export class GroupStreamsPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(items: Stream[]): StreamGroup[] {
    const groups = [];

    let last: string | undefined;

    for (const item of items) {
      const name = this._getName(item);

      if (!name) continue;

      if (last === name) {
        groups[groups.length - 1].streams.push(item);
      } else {
        groups.push({ name, streams: [item] });
      }

      last = name;
    }

    return groups;
  }

  _getName(stream: Stream): string {
    if (stream.status === StreamStatus.LIVE) {
      return "On Air";
    }

    const time =
      stream.status === StreamStatus.SCHEDULED
        ? stream.scheduleTime
        : stream.startTime;

    if (!time) return null;

    // TODO: support timezone settings

    if (isToday(time)) {
      return $localize`:@@Today:Today`;
    }

    if (isYesterday(time)) {
      return $localize`:@@Yesterday:Yesterday`;
    }

    if (isTomorrow(time)) {
      return $localize`:@@Tomorrow:Tomorrow`;
    }

    if (isFuture(time)) {
      if (isThisWeek(time)) {
        return $localize`:@@This week:This week`;
      }

      if (isThisMonth(time)) {
        return $localize`:@@This month:This month`;
      }

      if (isThisYear(time)) {
        return $localize`:@@This year:This year`;
      }

      return $localize`:@@Future:Future`;
    }

    if (isThisYear(time)) {
      return formatDate(time, "MM/dd", this.locale);
    }

    return formatDate(time, "yyyy/MM/dd", this.locale);
  }
}
