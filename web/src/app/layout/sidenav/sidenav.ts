import {
  Component,
  Output,
  EventEmitter,
  VERSION,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "hls-sidenav",
  templateUrl: "sidenav.html",
  styleUrls: ["sidenav.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Sidenav {
  @Output() buttonClick = new EventEmitter();

  readonly commitId = (window as any).cfPagesCommitSha.slice(0, 7);
  readonly angularVer = VERSION.full;
}
