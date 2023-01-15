import { Component } from "@angular/core";

import { TitleLanguageComponent } from "./title-language/title-language.component";
import { DisplayLanguageComponent } from "./display-language/display-language.component";

@Component({
  standalone: true,
  imports: [TitleLanguageComponent, DisplayLanguageComponent],
  selector: "hls-language",
  templateUrl: "./language.component.html",
})
export class LanguageComponent {}
