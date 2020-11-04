import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict } from "date-fns";

import { getDateFnsLocale } from "src/i18n/locale";

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  transform(start: number | Date, end: number | Date): string {
    return formatDistanceStrict(start, end, {
      locale: getDateFnsLocale(),
      addSuffix: true,
    });
  }
}
