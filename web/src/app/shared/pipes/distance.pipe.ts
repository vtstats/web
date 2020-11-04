import { Inject, Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict, Locale } from "date-fns";

import { DATE_FNS_LOCALE } from "src/i18n";

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  constructor(@Inject(DATE_FNS_LOCALE) private locale: Locale) {}

  transform(start: Date | number, end: Date | number): string {
    return formatDistanceStrict(start, end, {
      locale: this.locale,
      addSuffix: true,
    });
  }
}
