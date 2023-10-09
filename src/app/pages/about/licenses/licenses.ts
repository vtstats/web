import { Component } from "@angular/core";

import { query } from "src/app/shared/qry";

@Component({
  standalone: true,
  selector: "vts-licenses",
  templateUrl: "licenses.html",
})
export class Licenses {
  licensesQry = query({
    queryKey: ["3rdpartylicenses"],
    queryFn: () => fetch("/3rdpartylicenses.txt").then((res) => res.text()),
  });
}
