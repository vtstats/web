import {
  Component,
  ViewEncapsulation,
  EventEmitter,
  Output,
  Input
} from "@angular/core";

@Component({
  selector: "hs-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter();
}
