import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import type { Stream } from "src/app/models";
import { TickService } from "src/app/shared";

@Component({
  selector: "hs-stream-item",
  templateUrl: "stream-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "stream-item" },
})
export class StreamItem {
  constructor(private tick: TickService) {}

  everySecond$ = this.tick.everySecond$;
  everyMinute$ = this.tick.everyMinute$;

  @Input() stream: Stream;
}
