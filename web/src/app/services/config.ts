import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { CookieService } from "ngx-cookie";

import { vtubers } from "vtubers";

import { binToHash, hashToBin } from "./hash";

const defaultVTubers: string[] = Object.values(vtubers)
  .filter((v) => v.default)
  .map((v) => v.id);

const keys = Object.keys(vtubers);

@Injectable({ providedIn: "root" })
export class Config {
  selectedVTubers: Set<String> = new Set();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService
  ) {
    if (this.cookieService.get("t") === "d") {
      this.document.body.classList.add("dark");
    }

    const ids = this.cookieService.get("v");

    if (!ids) {
      this.selectedVTubers = new Set(defaultVTubers);
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

  selectVTubers(ids: string[]) {
    for (const id of ids) {
      this.selectedVTubers.add(id);
    }

    this.cookieService.put(
      "v",
      binToHash(keys.map((k) => (this.selectedVTubers.has(k) ? 1 : 0)).join(""))
    );
  }

  unselectVTubers(ids: string[]) {
    for (const id of ids) {
      this.selectedVTubers.delete(id);
    }

    this.cookieService.put(
      "v",
      binToHash(keys.map((k) => (this.selectedVTubers.has(k) ? 1 : 0)).join(""))
    );
  }

  toggleDarkMode() {
    if (this.cookieService.get("t") === "d") {
      this.cookieService.remove("t");
      this.document.body.classList.remove("dark");
    } else {
      this.cookieService.put("t", "d");
      this.document.body.classList.add("dark");
    }
  }
}
