import { Component, inject } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";

import { QryService } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [RouterModule, MatListModule],
  selector: "hls-miscellaneous",
  templateUrl: "./miscellaneous.component.html",
})
export class MiscellaneousComponent {
  qry = inject(QryService);
}
