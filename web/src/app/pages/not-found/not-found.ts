import { Component } from "@angular/core";

import { Helmet } from "src/app/components/helmet/helmet.component";

@Component({
  standalone: true,
  imports: [Helmet],
  selector: "hls-not-found",
  templateUrl: "not-found.html",
})
export class NotFound {}
