import { inject, Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";

@Injectable({ providedIn: "root" })
export class VtsTitleStrategy extends TitleStrategy {
  private title = inject(Title);
  private meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot) {
    // we don't have resolved title for these url
    if (
      snapshot.url.startsWith("/vtuber/") ||
      snapshot.url.startsWith("/youtube-stream/") ||
      snapshot.url.startsWith("/twitch-stream/") ||
      snapshot.url.startsWith("/stream/")
    ) {
      return;
    }

    let title = this.buildTitle(snapshot);
    title = title ? title + " | vtstats" : "vtstats";

    this.title.setTitle(title);
    this.meta.updateTag({ property: "og:title", content: title });
    this.meta.updateTag({ name: "twitter:title", content: title });
  }
}
