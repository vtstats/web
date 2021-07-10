import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict } from "date-fns";

import { getDateFnsLocale } from "src/i18n";

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  transform(start: number | Date, end: number | Date): string {
    if (!start || !end) return null;

    return formatDistanceStrict(start, end, {
      locale: getDateFnsLocale(),
      addSuffix: true,
    });
  }
}
