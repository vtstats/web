import { Pipe, PipeTransform } from "@angular/core";
import { parseISO } from "date-fns";

@Pipe({ name: "parseISO" })
export class ParseISOPipe implements PipeTransform {
  transform(value: string): Date {
    return parseISO(value);
  }
}
