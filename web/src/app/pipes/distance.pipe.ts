import { Pipe, PipeTransform } from "@angular/core";
import { formatDistanceToNow, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

@Pipe({ name: "distance" })
export class DistancePipe implements PipeTransform {
  transform(date: string): string {
    return formatDistanceToNow(parseISO(date), {
      addSuffix: true,
      locale: zhTW
    });
  }
}
