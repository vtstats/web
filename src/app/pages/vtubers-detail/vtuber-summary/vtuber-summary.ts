import { NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { Channel, Platform, VTuber } from "src/app/models";
import { AvatarPipe, NamePipe } from "src/app/shared";

@Component({
  standalone: true,
  imports: [MatIconModule, AvatarPipe, NamePipe, NgOptimizedImage],
  selector: "vts-vtuber-summary",
  templateUrl: "vtuber-summary.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VtuberSummary {
  vtuber = input.required<VTuber>();
  channels = input.required<Array<Channel>>();

  links = computed<{ href: string; icon: string }[]>(() => {
    const links = [];

    const yt = this.channels().find((c) => c.platform === Platform.YOUTUBE);
    if (yt) {
      links.push({
        href: "https://www.youtube.com/channel/" + yt.platformId,
        icon: "youtube",
      });
    }

    const tw = this.vtuber().twitterUsername;
    if (tw) {
      links.push({
        href: "https://twitter.com/" + tw,
        icon: "twitter",
      });
    }

    const bl = this.channels().find((c) => c.platform === "BILIBILI");
    if (bl) {
      links.push({
        href: "https://space.bilibili.com/" + bl.platformId,
        icon: "bilibili",
      });
    }

    return links;
  });
}
