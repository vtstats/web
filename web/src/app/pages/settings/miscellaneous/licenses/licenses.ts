import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";

import { Helmet } from "src/app/components/helmet/helmet.component";

@Component({
  standalone: true,
  imports: [CommonModule, Helmet],
  selector: "hls-licenses",
  templateUrl: "licenses.html",
})
export class Licenses {
  text$ = inject(HttpClient).get("/3rdpartylicenses.txt", {
    responseType: "text",
  });
}
