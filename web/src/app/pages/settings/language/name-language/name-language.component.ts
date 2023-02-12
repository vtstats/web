import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { VTuberService } from "src/app/shared/config/vtuber.service";

@Component({
  selector: "hls-name-language",
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, CommonModule],
  templateUrl: "./name-language.component.html",
})
export class NameLanguageComponent {
  nameSettings$ = inject(VTuberService).nameSettings$;

  readonly languages = [
    { value: "native_name", label: "Native (e.g. 白上フブキ, Mori Calliope)" },
    {
      value: "english_name",
      label: "English (e.g. Shirakami Fubuki, Mori Calliope)",
    },
    { value: "japanese_name", label: "Japanese (e.g. 白上フブキ, 森カリオペ)" },
  ];
}
