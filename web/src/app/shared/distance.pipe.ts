import { Pipe, PipeTransform } from "@angular/core";
import dayjs, { ConfigType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  transform(start: ConfigType, end: ConfigType): string {
    return dayjs(start).from(end);
  }
}
