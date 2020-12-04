import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict, parseISO } from "date-fns";

import { getDateFnsLocale } from "src/i18n/locale";

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  transform(start: Date | string, end: Date | string): string {
    return formatDistanceStrict(
      typeof start === "string" ? parseISO(start) : start,
      typeof end === "string" ? parseISO(end) : end,
      { locale: getDateFnsLocale(), addSuffix: true }
    );
  }
}
