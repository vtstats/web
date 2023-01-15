import { inject, Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict } from "date-fns";

import { DATE_FNS_LOCALE } from "src/i18n";

@Pipe({ standalone: true, name: "distance" })
export class DistancePipe implements PipeTransform {
  private dateFnsLocale = inject(DATE_FNS_LOCALE);

  transform(start: number | Date, end: number | Date): string {
    if (!start || !end) return null;

    return formatDistanceStrict(start, end, {
      locale: this.dateFnsLocale,
      addSuffix: true,
    });
  }
}
