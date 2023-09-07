import { Component, inject } from "@angular/core";

import { QryService, UseQryPipe } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [UseQryPipe],
  selector: "hls-licenses",
  templateUrl: "licenses.html",
})
export class Licenses {
  private qry = inject(QryService);

  licensesQry = this.qry.create({
    queryKey: ["3rdpartylicenses"],
    queryFn: () => fetch("/3rdpartylicenses.txt").then((res) => res.text()),
  });
}
