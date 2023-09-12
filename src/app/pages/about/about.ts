import { Component, VERSION, inject } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";

import { QryService } from "src/app/shared/qry";

@Component({
  standalone: true,
  selector: "vts-about",
  templateUrl: "about.html",
  imports: [RouterModule, MatListModule],
})
export class AboutPage {
  angularVer = VERSION.full;
  qry = inject(QryService);
}
