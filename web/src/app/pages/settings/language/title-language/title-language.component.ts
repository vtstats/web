import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { ConfigService } from "src/app/shared";

@Component({
  selector: "hls-title-language",
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: "./title-language.component.html",
})
export class TitleLanguageComponent {
  config = inject(ConfigService);

  readonly languages = [
    { value: "native", label: "Native (白上フブキ, Mori Calliope)" },
    { value: "romaji", label: "Romaji (Shirakami Fubuki, Mori Calliope)" },
    { value: "english", label: "English (Shirakami Fubuki, Mori Calliope)" },
    { value: "japanese", label: "Japanese (白上フブキ, 森カリオペ)" },
  ];
}
