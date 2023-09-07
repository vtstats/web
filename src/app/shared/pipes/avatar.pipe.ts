import { inject, Pipe, PipeTransform } from "@angular/core";
import { VTuberService } from "../config/vtuber.service";

@Pipe({ standalone: true, name: "avatar" })
export class AvatarPipe implements PipeTransform {
  private vtuberSrv = inject(VTuberService);

  transform(id: string): string {
    return (
      this.vtuberSrv.vtubers().find((v) => v.vtuberId === id)?.thumbnailUrl ||
      ""
    );
  }
}
