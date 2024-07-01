import { Component, VERSION, inject } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { QueryService } from "src/app/shared/config/query.service";

@Component({
  standalone: true,
  selector: "vts-about",
  templateUrl: "about.html",
  imports: [RouterModule, MatListModule],
})
export class AboutPage {
  angularVer = VERSION.full;
  query = inject(QueryService);
}
