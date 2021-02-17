import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

import type { Stream } from "src/app/models";
import { TickService } from "src/app/shared";

@Component({
  selector: "hs-stream-item",
  templateUrl: "stream-item.html",
  styleUrls: ["stream-item.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "stream-item" },
})
export class StreamItem {
  constructor(private tick: TickService) {}

  everySecond$ = this.tick.everySecond$;
  everyMinute$ = this.tick.everyMinute$;

  @Input() stream: Stream;
}

@Component({
  selector: "hs-stream-item-shimmer",
  templateUrl: "stream-item-shimmer.html",
  styleUrls: ["stream-item.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "stream-item" },
})
export class StreamItemShimmer {}
