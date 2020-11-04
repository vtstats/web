import { Pipe, PipeTransform } from "@angular/core";
import { formatISO } from "date-fns";

@Pipe({ name: "formatISO" })
export class FormatISOPipe implements PipeTransform {
  transform(date: number | Date | undefined): string {
    if (!date) return "";

    return formatISO(date);
  }
}
