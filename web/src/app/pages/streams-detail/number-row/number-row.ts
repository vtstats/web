import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "hls-number-row",
  template: "<ng-content></ng-content>",
  styleUrls: ["number-row.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "number-row" },
})
export class NumberRow {}
