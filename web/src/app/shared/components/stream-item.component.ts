import { Component, Input } from "@angular/core";

import type { Stream } from "src/app/models";

import { TickService } from "../services/tick.service";

@Component({
  selector: "hs-stream-item",
  templateUrl: "./stream-item.component.html",
})
export class StreamItemComponent {
  constructor(private tick: TickService) {}

  everySecond$ = this.tick.everySecond$;
  everyMinute$ = this.tick.everyMinute$;

  @Input() stream: Stream;
}
