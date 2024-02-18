import { Component, LOCALE_ID, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { ConfigService } from "src/app/shared";

@Component({
  selector: "vts-display-language",
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: "./display-language.component.html",
})
export class DisplayLanguageComponent {
  locale = inject(LOCALE_ID);
  config = inject(ConfigService);

  readonly languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "ja", label: "日本語" },
    { value: "ms", label: "Melayu" },
    { value: "zh", label: "中文" },
  ];
}
