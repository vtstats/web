import {
  Component,
  ViewEncapsulation,
  EventEmitter,
  Output,
  Input
} from "@angular/core";

@Component({
  selector: "hs-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
  @Output() menuClick = new EventEmitter();
}
