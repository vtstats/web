import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { NamePipe } from "src/app/shared";
import { VTuber } from "src/app/shared/config/vtuber.service";

@Component({
  standalone: true,
  imports: [MatIconModule, CommonModule, NamePipe],
  selector: "hls-vtuber-summary",
  templateUrl: "vtuber-summary.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VtuberSummary {
  @Input() vtuber: VTuber;

  get links(): { href: string; icon: string }[] {
    const links = [];

    if (this.vtuber.youtube) {
      links.push({
        href: "https://www.youtube.com/channel/" + this.vtuber.youtube,
        icon: "youtube",
      });
    }

    if (this.vtuber.twitter) {
      links.push({
        href: "https://twitter.com/" + this.vtuber.twitter,
        icon: "twitter",
      });
    }

    if (this.vtuber.bilibili) {
      links.push({
        href: "https://space.bilibili.com/" + this.vtuber.bilibili,
        icon: "bilibili",
      });
    }

    return links;
  }
}
