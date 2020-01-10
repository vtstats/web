import {
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
  VERSION
} from "@angular/core";

import { environment } from "src/environments/environment";

@Component({
  selector: "hs-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent {
  @Output() buttonClick = new EventEmitter();

  readonly commitHash = environment.commit_hash;
  readonly angularVer = VERSION.full;
}
