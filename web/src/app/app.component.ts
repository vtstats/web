import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: "hs-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.addIcon("arrow_back");
    this.addIcon("chevron_right");
    this.addIcon("expand_more");
    this.addIcon("eye");
    this.addIcon("logo");
    this.addIcon("settings");
  }

  addIcon(name: string) {
    this.iconRegistry.addSvgIcon(
      name,
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${name}.svg`)
    );
  }
}
