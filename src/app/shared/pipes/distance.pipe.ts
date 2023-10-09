import { inject, Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict } from "date-fns";

import { DATE_FNS_LOCALE } from "../tokens";

@Pipe({ standalone: true, name: "distance" })
export class DistancePipe implements PipeTransform {
  dateFns = inject(DATE_FNS_LOCALE);

  transform(start: number | Date, end: number | Date): string | null {
    if (!start || !end) return null;

    return formatDistanceStrict(start, end, {
      locale: this.dateFns,
      addSuffix: true,
    });
  }
}
