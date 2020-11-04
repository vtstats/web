import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "hs-sub-menu-title",
  template: "<ng-content></ng-content>",
  host: { class: "title" },
})
export class SubMenuTitle {}

@Component({
  selector: "hs-sub-menu-extra",
  template: "<ng-content></ng-content>",
  host: { class: "extra" },
})
export class SubMenuExtra {}

@Component({
  selector: "hs-sub-menu",
  templateUrl: "sub-menu.html",
  styleUrls: ["sub-menu.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "sub-menu" },
})
export class SubMenu {}
