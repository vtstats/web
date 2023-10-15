import { inject, Pipe, PipeTransform } from "@angular/core";
import { CATALOG_VTUBERS } from "../tokens";

@Pipe({ standalone: true, name: "avatar" })
export class AvatarPipe implements PipeTransform {
  private vtubers = inject(CATALOG_VTUBERS);

  transform(id?: string): string {
    if (!id) return "";
    return this.vtubers.find((v) => v.vtuberId === id)?.thumbnailUrl || "";
  }
}
