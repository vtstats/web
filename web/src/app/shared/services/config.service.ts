import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { CookieService } from "ngx-cookie";

import { vtubers } from "vtubers";

import { binToHash, hashToBin } from "./hash";

const keys = Object.keys(vtubers);

@Injectable({ providedIn: "root" })
export class ConfigService {
  selectedVTubers: Set<string>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.getItem("t") === "d") {
      this.document.body.classList.add("dark");
    }

    const ids = this.getItem("v");

    if (!ids) {
      this.selectedVTubers = new Set(
        Object.values(vtubers)
          .filter((v) => v.default)
          .map((v) => v.id)
      );
      return;
    }

    const bin = hashToBin(ids);

    const v = bin.split("").reduce((acc, cur, idx) => {
      if (cur === "1") {
        acc.push(keys[idx]);
      }

      return acc;
    }, [] as string[]);

    this.selectedVTubers = new Set(v);
  }

  get joinedSelectedVTubers(): string {
    return Array.from(this.selectedVTubers).join(",");
  }

  private getItem(key: string): string | false {
    return (
      this.cookieService.get(key) ||
      (isPlatformBrowser(this.platformId) && window.localStorage.getItem(key))
    );
  }

  private setItem(key: string, value: string) {
    this.cookieService.put(key, value, { secure: true });
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(key, value);
    }
  }

  private removeItem(key: string) {
    this.cookieService.remove(key);
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(key);
    }
  }

  selectVTubers(ids: string[]) {
    for (const id of ids) {
      this.selectedVTubers.add(id);
    }

    this.setItem(
      "v",
      binToHash(keys.map((k) => (this.selectedVTubers.has(k) ? 1 : 0)).join(""))
    );
  }

  unselectVTubers(ids: string[]) {
    for (const id of ids) {
      this.selectedVTubers.delete(id);
    }

    this.setItem(
      "v",
      binToHash(keys.map((k) => (this.selectedVTubers.has(k) ? 1 : 0)).join(""))
    );
  }

  toggleDarkMode() {
    if (this.getItem("t") === "d") {
      this.removeItem("t");
      this.document.body.classList.remove("dark");
    } else {
      this.setItem("t", "d");
      this.document.body.classList.add("dark");
    }
  }

  selectLanguage(locale: string) {
    this.setItem("l", locale);
    location.reload();
  }

  getLocale(): string | false {
    return this.getItem("l");
  }
}
