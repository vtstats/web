import { Component } from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";

@Component({
  standalone: true,
  selector: "vts-licenses",
  templateUrl: "licenses.html",
})
export class Licenses {
  licensesQry = injectQuery(() => ({
    queryKey: ["3rdpartylicenses"],
    queryFn: () => fetch("/3rdpartylicenses.txt").then((res) => res.text()),
  }));
}
