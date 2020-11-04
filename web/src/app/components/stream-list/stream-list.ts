import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "hs-stream-list",
  styleUrls: ["stream-list.scss"],
  template: "<ng-content></ng-content>",
  encapsulation: ViewEncapsulation.None,
  host: { class: "stream-list" },
})
export class StreamsList {}
