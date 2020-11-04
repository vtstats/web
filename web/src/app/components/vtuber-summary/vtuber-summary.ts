import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";

import type { Channel, VTuber } from "src/app/models";

@Component({
  selector: "hs-vtuber-summary",
  templateUrl: "vtuber-summary.html",
  styleUrls: ["vtuber-summary.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VTubeSummary {
  @Input() loading: boolean;
  @Input() vtuber: VTuber;
  @Input() channels: Channel[];

  get hasYouTubeChannel(): boolean {
    return !!this.vtuber.youtube;
  }

  get hasBilibiliChannel(): boolean {
    return !!this.vtuber.bilibili;
  }
}
