import { Component } from "@angular/core";

import { NameLanguageComponent } from "./name-language/name-language.component";
import { DisplayLanguageComponent } from "./display-language/display-language.component";

@Component({
  standalone: true,
  imports: [NameLanguageComponent, DisplayLanguageComponent],
  selector: "hls-language",
  templateUrl: "./language.component.html",
})
export class LanguageComponent {}
