import { inject, Pipe, PipeTransform } from "@angular/core";
import { VTuberService } from "../config/vtuber.service";

@Pipe({ standalone: true, name: "name" })
export class NamePipe implements PipeTransform {
  private vtuberSrv = inject(VTuberService);

  transform(id: string): string {
    return this.vtuberSrv.vtuberNames()[id];
  }
}
