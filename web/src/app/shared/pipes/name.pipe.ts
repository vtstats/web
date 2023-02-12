import { inject, Pipe, PipeTransform } from "@angular/core";
import { VTuberService } from "../config/vtuber.service";

@Pipe({ standalone: true, name: "name" })
export class NamePipe implements PipeTransform {
  private vtuberSrv = inject(VTuberService);

  transform(value: string): string {
    return this.vtuberSrv.getName(value);
  }
}
