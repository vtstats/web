import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

import { Helmet } from "src/app/components/helmet/helmet.component";
import { QryService, UseQryPipe } from "src/app/shared/qry";

@Component({
  standalone: true,
  imports: [Helmet, CommonModule, UseQryPipe],
  selector: "hls-ngsw-settings",
  templateUrl: "ngsw-settings.html",
})
export class NgswSettings {
  isEnabled = inject(SwUpdate).isEnabled;

  private qry = inject(QryService);

  ngswStateQry = this.qry.create({
    queryKey: ["ngswState"],
    queryFn: () => fetch("/ngsw/state").then((res) => res.text()),
  });
}
