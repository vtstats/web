import { Pipe, PipeTransform } from "@angular/core";
import { differenceInSeconds } from "date-fns";

@Pipe({ name: "duration" })
export class DurationPipe implements PipeTransform {
  transform(dateLeft: string, dateRight?: string): string {
    const seconds = differenceInSeconds(
      dateRight ? new Date(dateRight) : new Date(),
      new Date(dateLeft)
    );
    const hh = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mm = ((seconds % 3600) % 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
}
