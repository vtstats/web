import { inject, Pipe, PipeTransform } from "@angular/core";
import { formatDistanceStrict } from "date-fns";

import { LocaleService } from "../config/locale.service";

@Pipe({ standalone: true, name: "distance" })
export class DistancePipe implements PipeTransform {
  private locale = inject(LocaleService);

  transform(start: number | Date, end: number | Date): string {
    if (!start || !end) return null;

    return formatDistanceStrict(start, end, {
      locale: this.locale.dateFns,
      addSuffix: true,
    });
  }
}
