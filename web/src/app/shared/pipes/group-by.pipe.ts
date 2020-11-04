import { Pipe, PipeTransform } from "@angular/core";
import { isSameDay } from "date-fns";

import { Stream } from "src/app/models";

type SteamGroup = {
  date: number;
  streams: Stream[];
};

@Pipe({ name: "groupBy" })
export class GroupByPipe implements PipeTransform {
  transform(data: Stream[], key: "startTime" | "scheduleTime"): SteamGroup[] {
    const res: SteamGroup[] = [];

    let last: number | undefined;

    for (const stream of data) {
      if (last && isSameDay(last, stream[key])) {
        res[res.length - 1].streams.push(stream);
      } else {
        res.push({ date: stream[key], streams: [stream] });
      }
      last = stream[key];
    }

    return res;
  }
}
