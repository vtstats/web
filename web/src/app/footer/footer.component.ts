import { Component } from "@angular/core";

import { environment } from "../../environments/environment";

@Component({
  selector: "hs-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent {
  commit_hash = environment.commit_hash;
}
