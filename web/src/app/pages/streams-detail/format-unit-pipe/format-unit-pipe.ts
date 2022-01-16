import { Inject, Pipe, PipeTransform } from "@angular/core";
import { formatDuration, Locale } from "date-fns";

import { DATE_FNS_LOCALE } from "src/i18n";

@Pipe({
  name: "formatUnit",
})
export class FormatUnitPipe implements PipeTransform {
  constructor(@Inject(DATE_FNS_LOCALE) private dateLocale: Locale) {}

  transform(value: number | string): string {
    if (typeof value === "string") {
      return value[0].toUpperCase() + value.substr(1).toLowerCase();
    }

    if (value >= 60000) {
      return formatDuration(
        { minutes: value / 60000 },
        { locale: this.dateLocale }
      );
    }

    return formatDuration(
      { seconds: value / 1000 },
      { locale: this.dateLocale }
    );
  }
}
