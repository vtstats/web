import { inject, Pipe, PipeTransform } from "@angular/core";
import { Duration, formatDuration } from "date-fns";
import { LocaleService } from "src/app/shared/config/locale.service";

@Pipe({ standalone: true, name: "formatDayDuration" })
export class FormatDayDurationPipe implements PipeTransform {
  private locale = inject(LocaleService);

  transform(value: Duration): string {
    return formatDuration(value, { locale: this.locale.dateFns });
  }
}
