import { Component } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterModule, MatListModule],
  selector: "hls-miscellaneous",
  templateUrl: "./miscellaneous.component.html",
})
export class MiscellaneousComponent {}
