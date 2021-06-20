import {
  Component,
  Output,
  EventEmitter,
  VERSION,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "hs-sidenav",
  templateUrl: "sidenav.html",
  styleUrls: ["sidenav.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Sidenav {
  @Output() buttonClick = new EventEmitter();

  readonly angularVer = VERSION.full;
}
