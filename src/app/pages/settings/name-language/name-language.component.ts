import { NgFor } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { VTuberService } from "src/app/shared/config/vtuber.service";

@Component({
  selector: "hls-name-language",
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor],
  templateUrl: "./name-language.component.html",
})
export class NameLanguageComponent {
  nameSetting = inject(VTuberService).nameSetting;

  readonly languages = [
    { value: "nativeName", label: "Native (e.g. 白上フブキ, Mori Calliope)" },
    {
      value: "englishName",
      label: "English (e.g. Shirakami Fubuki, Mori Calliope)",
    },
    { value: "japaneseName", label: "Japanese (e.g. 白上フブキ, 森カリオペ)" },
  ];
}
