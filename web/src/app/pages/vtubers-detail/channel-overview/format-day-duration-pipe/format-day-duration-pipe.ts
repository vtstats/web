import { inject, Pipe, PipeTransform } from "@angular/core";
import { Duration, formatDuration } from "date-fns";

import { DATE_FNS_LOCALE } from "src/i18n";

@Pipe({
  standalone: true,
  name: "formatDayDuration",
})
export class FormatDayDurationPipe implements PipeTransform {
  private dateFnsLocale = inject(DATE_FNS_LOCALE);

  transform(value: Duration): string {
    return formatDuration(value, { locale: this.dateFnsLocale });
  }
}
