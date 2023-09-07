import { inject, Pipe, PipeTransform } from "@angular/core";
import { formatDuration } from "date-fns";

import { LocaleService } from "../config/locale.service";

@Pipe({ standalone: true, name: "formatDuration" })
export class FormatDurationPipe implements PipeTransform {
  private locale = inject(LocaleService);

  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);

    return formatDuration({ hours, minutes }, { locale: this.locale.dateFns });
  }
}
