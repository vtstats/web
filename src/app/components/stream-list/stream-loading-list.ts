import { Component, booleanAttribute, input } from "@angular/core";

import { StreamItemShimmer } from "./stream-item/stream-item-shimmer";

@Component({
  standalone: true,
  selector: "vts-stream-loading-list",
  templateUrl: "stream-loading-list.html",
  imports: [StreamItemShimmer],
})
export class StreamLoadingList {
  groupBy = input(false, { transform: booleanAttribute });
}
