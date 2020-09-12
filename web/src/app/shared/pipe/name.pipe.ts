import { Pipe, PipeTransform, Inject } from "@angular/core";

import { LOCAL_NAMES, LocalNames } from "src/i18n/names";

@Pipe({ name: "name" })
export class NamePipe implements PipeTransform {
  constructor(@Inject(LOCAL_NAMES) private names: LocalNames) {}

  transform(value: string): string {
    return this.names[value];
  }
}
