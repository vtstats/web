import { Pipe, PipeTransform, Inject } from "@angular/core";
import { formatDistanceStrict, parseISO, Locale } from "date-fns";

import { DATE_FNS_LOCALE } from "src/i18n";

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  constructor(@Inject(DATE_FNS_LOCALE) private locale: Locale) {}

  transform(start: Date | string, end: Date | string): string {
    return formatDistanceStrict(
      typeof start === "string" ? parseISO(start) : start,
      typeof end === "string" ? parseISO(end) : end,
      { locale: this.locale, addSuffix: true }
    );
  }
}
