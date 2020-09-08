import { Pipe, PipeTransform } from "@angular/core";
import dayjs, { ConfigType } from "dayjs";

@Pipe({ name: "format" })
export class FormatPipe implements PipeTransform {
  transform(date: ConfigType, template: string): string {
    return dayjs(date).format(template);
  }
}
