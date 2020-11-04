import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

import type { Stream } from "src/app/models";
import { TickService } from "src/app/shared";

@Component({
  selector: "hs-stream-summary",
  templateUrl: "stream-summary.html",
  styleUrls: ["stream-summary.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamsSummary {
  constructor(private tick: TickService) {}

  @Input() loading: boolean;
  @Input() stream: Stream;

  everySecond$ = this.tick.everySecond$;
}
