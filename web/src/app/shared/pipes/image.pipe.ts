import { Pipe, PipeTransform } from "@angular/core";

import { vtubers } from "vtubers";

@Pipe({ name: "image" })
export class ImagePipe implements PipeTransform {
  transform(id: string): string {
    return vtubers[id].image;
  }
}
