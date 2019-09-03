import { Pipe, PipeTransform } from "@angular/core";
import { differenceInSeconds } from "date-fns";

@Pipe({ name: "duration" })
export class DurationPipe implements PipeTransform {
  transform(dateLeft: string | Date, dateRight?: string): string {
    const seconds = differenceInSeconds(
      typeof dateLeft == "string" ? new Date(dateLeft) : dateLeft,
      dateRight ? new Date(dateRight) : new Date()
    );
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds - hh * 3600) / 60);
    const ss = seconds - hh * 3600 - mm * 60;
    return (
      hh.toString().padStart(2, "0") +
      ":" +
      mm.toString().padStart(2, "0") +
      ":" +
      ss.toString().padStart(2, "0")
    );
  }
}
