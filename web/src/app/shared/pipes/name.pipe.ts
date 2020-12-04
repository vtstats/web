import { Pipe, PipeTransform } from "@angular/core";

import { translate } from "src/i18n/translations";

@Pipe({ name: "name" })
export class NamePipe implements PipeTransform {
  transform(value: string): string {
    return translate(value);
  }
}
