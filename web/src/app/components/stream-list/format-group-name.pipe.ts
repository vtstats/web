import { formatDate } from "@angular/common";
import { inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import { isThisYear, isToday, isTomorrow, isYesterday } from "date-fns";

@Pipe({
  standalone: true,
  name: "formatGroupName",
})
export class FormatGroupNamePipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(value: Date | string): string {
    if (typeof value === "string") return value;

    // TODO: support timezone settings

    if (isYesterday(value)) {
      return $localize`Yesterday`;
    }

    if (isToday(value)) {
      return $localize`Today`;
    }

    if (isTomorrow(value)) {
      return $localize`Tomorrow`;
    }

    if (isThisYear(value)) {
      return formatDate(value, "MM/dd", this.locale);
    }

    return formatDate(value, "yyyy/MM/dd", this.locale);
  }
}
