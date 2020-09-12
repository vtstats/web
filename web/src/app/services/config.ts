import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

import { vtubers } from "vtubers";

const defaultSelectedVTubers: string[] = Object.values(vtubers)
  .filter((v) => v.default)
  .map((v) => v.id);

export const ENABLE_DARK_MODE = "holostats:enableDarkMode";
export const SELECTED_VTUBERS = "holostats:selectedVTubers";

@Injectable({ providedIn: "root" })
export class Config {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  selectedVTubers: Set<String> = new Set(
    (isPlatformBrowser(this.platformId) &&
      window.localStorage
        .getItem(SELECTED_VTUBERS)
        ?.split(",")
        .filter((id) => Object.keys(vtubers).includes(id))) ||
      defaultSelectedVTubers
  );

  get joinedSelectedVTubers(): string {
    return Array.from(this.selectedVTubers).join(",");
  }

  selectVTubers(vtubers: string[]) {
    for (const vtuber of vtubers) {
      this.selectedVTubers.add(vtuber);
    }
    window.localStorage.setItem(SELECTED_VTUBERS, this.joinedSelectedVTubers);
  }

  unselectVTubers(vtubers: string[]) {
    for (const vtuber of vtubers) {
      this.selectedVTubers.delete(vtuber);
    }
    window.localStorage.setItem(SELECTED_VTUBERS, this.joinedSelectedVTubers);
  }

  toggleDarkMode() {
    if (!window.localStorage.getItem(ENABLE_DARK_MODE)) {
      window.localStorage.setItem(ENABLE_DARK_MODE, "t");
      document.body.classList.add("dark");
    } else {
      window.localStorage.removeItem(ENABLE_DARK_MODE);
      document.body.classList.remove("dark");
    }
  }
}
