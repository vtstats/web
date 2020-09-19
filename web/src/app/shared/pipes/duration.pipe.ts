import { Pipe, PipeTransform } from "@angular/core";
import { differenceInSeconds, parseISO } from "date-fns";

@Pipe({ name: "duration" })
export class DurationPipe implements PipeTransform {
  transform(start: string, end: Date | string): string {
    const seconds = differenceInSeconds(
      typeof end === "string" ? parseISO(end) : end,
      parseISO(start)
    );

    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds - hh * 3600) / 60);
    const ss = seconds - hh * 3600 - mm * 60;

    const hh_str = hh.toString().padStart(2, "0");
    const mm_str = mm.toString().padStart(2, "0");
    const ss_str = ss.toString().padStart(2, "0");

    return hh == 0 ? `${mm_str}:${ss_str}` : `${hh_str}:${mm_str}:${ss_str}`;
  }
}
