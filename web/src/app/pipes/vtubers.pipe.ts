import { Pipe, PipeTransform } from "@angular/core";

import { vtubers } from "vtubers";

import { VTuber } from "src/app/models";

@Pipe({ name: "vtubers" })
export class VTubersPipe implements PipeTransform {
  transform(value: string): VTuber {
    return vtubers[value];
  }
}
