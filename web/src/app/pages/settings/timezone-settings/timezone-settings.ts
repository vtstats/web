import { Component } from "@angular/core";

import { ConfigService, TickService } from "src/app/shared";

@Component({
  selector: "hls-timezone-settings",
  templateUrl: "timezone-settings.html",
  styleUrls: ["timezone-settings.scss"],
})
export class TimezoneSettings {
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

  constructor(public config: ConfigService, public tick: TickService) {}
}
