import { Pipe, PipeTransform } from "@angular/core";
import { isAfter, parseISO } from "date-fns";

import { Stream } from "@holostats/libs/models";

@Pipe({ name: "sortByDate" })
export class SortByDatePipe implements PipeTransform {
  transform(streams: Stream[]): Stream[] {
    return streams.sort((a, b) =>
      isAfter(parseISO(a.start), parseISO(b.start)) ? -1 : 1
    );
  }
}
