import { Component } from "@angular/core";
import { MatBottomSheet } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

import { SettingsSheetComponent } from "../settings-sheet";

@Component({
  selector: "hs-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
  constructor(
    private bottomSheet: MatBottomSheet,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "holo-stats",
      sanitizer.bypassSecurityTrustResourceUrl("assets/logo.svg")
    );
  }

  openSettings() {
    this.bottomSheet.open(SettingsSheetComponent);
  }
}
