import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";

import { Helmet } from "src/app/components/helmet/helmet.component";
import { QryService, UseQryPipe } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [CommonModule, Helmet, UseQryPipe],
  selector: "hls-licenses",
  templateUrl: "licenses.html",
})
export class Licenses {
  private qry = inject(QryService);

  licensesQry = this.qry.create({
    queryKey: ["licenses"],
    queryFn: () => fetch("/3rdpartylicenses.txt").then((res) => res.text()),
  });
}
