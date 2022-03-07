import { Inject, Pipe, PipeTransform } from "@angular/core";
import { formatDuration, Locale, Duration } from "date-fns";

import { DATE_FNS_LOCALE } from "src/i18n";

@Pipe({
  name: "formatDayDuration",
})
export class FormatDayDurationPipe implements PipeTransform {
  constructor(@Inject(DATE_FNS_LOCALE) private locale: Locale) {}

  transform(value: Duration): string {
    return formatDuration(value, { locale: this.locale });
  }
}
