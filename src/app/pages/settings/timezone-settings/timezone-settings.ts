import { AsyncPipe, DatePipe, NgFor } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

import { ConfigService, TickService } from "src/app/shared";

@Component({
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, AsyncPipe, DatePipe],
  selector: "vts-timezone-settings",
  templateUrl: "timezone-settings.html",
})
export class TimezoneSettings {
  everyMinute$ = inject(TickService).everyMinute$;

  readonly timezones = [
    "-12:00",
    "-11:00",
    "-10:00",
    "-09:00",
    "-08:00",
    "-07:00",
    "-06:00",
    "-05:00",
    "-04:00",
    "-03:30",
    "-03:00",
    "-02:00",
    "-01:00",
    "+00:00",
    "+01:00",
    "+02:00",
    "+03:00",
    "+03:30",
    "+04:00",
    "+04:30",
    "+05:00",
    "+05:30",
    "+05:45",
    "+06:00",
    "+06:30",
    "+07:00",
    "+08:00",
    "+09:00",
    "+09:30",
    "+10:00",
    "+11:00",
    "+12:00",
    "+13:00",
  ];

  constructor(public config: ConfigService) {}
}
