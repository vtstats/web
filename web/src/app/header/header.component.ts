import {
  Component,
  ViewEncapsulation,
  EventEmitter,
  Output
} from "@angular/core";

import { Config } from "../services";

@Component({
  selector: "hs-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter();

  constructor(public config: Config) {}
}
