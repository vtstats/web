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
    { value: "fil", label: "Filipino" },
    { value: "id", label: "Bahasa Indonesia" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "ms", label: "Melayu" },
    { value: "ru", label: "Русский" },
    { value: "vi", label: "Tiếng Việt" },
    { value: "zh", label: "中文" },
  ];
}
