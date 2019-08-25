import { VERSION, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";

import { ListDialogComponent } from "../list-dialog";

@Component({
  selector: "settings-sheet",
  templateUrl: "./settings-sheet.component.html",
  styleUrls: ["./settings-sheet.component.scss"]
})
export class SettingsSheetComponent {
  constructor(
    private sheetRef: MatBottomSheetRef<SettingsSheetComponent>,
    private dialog: MatDialog
  ) {}

  readonly ANGULAR_VERSION = VERSION.full;

  toggleDarkTheme() {
    if (localStorage.getItem("holostats:enableDarkMode") !== null) {
      localStorage.removeItem("holostats:enableDarkMode");
      document.body.classList.remove("dark");
    } else {
      localStorage.setItem("holostats:enableDarkMode", "t");
      document.body.classList.add("dark");
    }
    this.sheetRef.dismiss();
  }

  openList() {
    this.sheetRef.dismiss();
    this.dialog.open(ListDialogComponent, { minWidth: 400 });
  }
}
