import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { isThisYear } from "date-fns";

import { Stream, StreamGroup as Group } from "src/app/models";

@Component({
  selector: "hls-stream-group",
  templateUrl: "stream-group.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamGroup {
  @Input() group: Group;

  isThisYear = isThisYear;

  trackBy(_: number, stream: Stream): string {
    return stream.streamId;
  }
}
