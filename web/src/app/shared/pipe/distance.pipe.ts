import { Pipe, PipeTransform, Inject, LOCALE_ID } from "@angular/core";
import { formatDistanceStrict, parseISO, Locale } from "date-fns";
import dateFnsLocaleEn from "date-fns/locale/en-US";
import dateFnsLocaleZh from "date-fns/locale/zh-TW";

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(start: Date | string, end: Date | string): string {
    return formatDistanceStrict(
      typeof start === "string" ? parseISO(start) : start,
      typeof end === "string" ? parseISO(end) : end,
      { locale: getDateFnsLocale(this.locale), addSuffix: true }
    );
  }
}

function getDateFnsLocale(locale: string): Locale {
  switch (locale) {
    case "zh":
      return dateFnsLocaleZh;
    case "en":
    default:
      return dateFnsLocaleEn;
  }
}
