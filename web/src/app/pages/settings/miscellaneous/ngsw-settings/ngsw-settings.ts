import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

import { Helmet } from "src/app/components/helmet/helmet.component";

@Component({
  standalone: true,
  imports: [Helmet, CommonModule],
  selector: "hls-ngsw-settings",
  templateUrl: "ngsw-settings.html",
})
export class NgswSettings {
  isEnabled = inject(SwUpdate).isEnabled;
  state$ = inject(HttpClient).get("/ngsw/state", { responseType: "text" });
}
