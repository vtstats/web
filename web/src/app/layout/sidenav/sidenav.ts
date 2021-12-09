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

  readonly commitId = environment.commit_sha.slice(0, 7);
  readonly angularVer = VERSION.full;
}
