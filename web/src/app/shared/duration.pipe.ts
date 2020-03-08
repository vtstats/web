import { Pipe, PipeTransform } from "@angular/core";
import { differenceInSeconds } from "date-fns";

@Pipe({ name: "duration" })
export class DurationPipe implements PipeTransform {
  transform(start: Date, end: Date): string {
    const seconds = differenceInSeconds(end, start);

    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds - hh * 3600) / 60);
    const ss = seconds - hh * 3600 - mm * 60;

    const hh_string = hh.toString().padStart(2, "0");
    const mm_string = mm.toString().padStart(2, "0");
    const ss_string = ss.toString().padStart(2, "0");

    return hh == 0
      ? `${mm_string}:${ss_string}`
      : `${hh_string}:${mm_string}:${ss_string}`;
  }
}
