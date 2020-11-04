import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "hs-number-row",
  template: "<ng-content></ng-content>",
  styleUrls: ["number-row.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "number-row" },
})
export class NumberRow {}
