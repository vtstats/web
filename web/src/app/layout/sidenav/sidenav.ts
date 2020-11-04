import {
  Component,
  Output,
  EventEmitter,
  VERSION,
  ViewEncapsulation,
} from "@angular/core";

import { environment } from "src/environments/environment";

@Component({
  selector: "hs-sidenav",
  templateUrl: "sidenav.html",
  styleUrls: ["sidenav.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Sidenav {
  @Output() buttonClick = new EventEmitter();

  readonly commitHash = environment.commit_hash;
  readonly angularVer = VERSION.full;
}
