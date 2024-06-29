import { Component, inject } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import { injectQuery } from "@tanstack/angular-query-experimental";

@Component({
  standalone: true,
  imports: [],
  selector: "vts-ngsw-settings",
  templateUrl: "ngsw-settings.html",
})
export class NgswSettings {
  isEnabled = inject(SwUpdate).isEnabled;

  ngswStateQry = injectQuery(() => ({
    queryKey: ["ngsw/state"],
    queryFn: () => fetch("/ngsw/state").then((res) => res.text()),
  }));
}
