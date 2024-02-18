import { Component, inject } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

import { query } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [],
  selector: "vts-ngsw-settings",
  templateUrl: "ngsw-settings.html",
})
export class NgswSettings {
  isEnabled = inject(SwUpdate).isEnabled;

  ngswStateQry = query({
    queryKey: ["ngsw/state"],
    queryFn: () => fetch("/ngsw/state").then((res) => res.text()),
  });
}
