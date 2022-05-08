import { HttpClient } from "@angular/common/http";
import { Component, ViewEncapsulation } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "hls-ngsw-settings",
  templateUrl: "ngsw-settings.html",
  styleUrls: ["ngsw-settings.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NgswSettings {
  constructor(private http: HttpClient, public swUpdate: SwUpdate) {}

  state$ = this.http.get("/ngsw/state", { responseType: "text" });
}
