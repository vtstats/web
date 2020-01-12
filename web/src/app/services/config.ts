import { Injectable } from "@angular/core";

import * as vtubers from "vtubers";

const defaultSelectedVTubers: string[] = vtubers.items.reduce(
  (acc, item) => [
    ...acc,
    ...item.members.filter(m => m.default).map(m => m.id)
  ],
  []
);

export const ENABLE_DARK_MODE = "holostats:enableDarkMode";
export const SELECTED_VTUBERS = "holostats:selectedVTubers";

@Injectable({ providedIn: "root" })
export class Config {
  selectedVTubers: Set<String> = localStorage.getItem(SELECTED_VTUBERS)
    ? new Set(localStorage.getItem(SELECTED_VTUBERS).split(","))
    : new Set(defaultSelectedVTubers);

  get joinedSelectedVTubers(): string {
    return Array.from(this.selectedVTubers).join(",");
  }

  selectVTubers(vtubers: string[]) {
    for (const vtuber of vtubers) {
      this.selectedVTubers.add(vtuber);
    }
    localStorage.setItem(SELECTED_VTUBERS, this.joinedSelectedVTubers);
  }

  unselectVTubers(vtubers: string[]) {
    for (const vtuber of vtubers) {
      this.selectedVTubers.delete(vtuber);
    }
    localStorage.setItem(SELECTED_VTUBERS, this.joinedSelectedVTubers);
  }

  toggleDarkMode() {
    if (!localStorage.getItem(ENABLE_DARK_MODE)) {
      localStorage.setItem(ENABLE_DARK_MODE, "t");
      document.body.classList.add("dark");
    } else {
      localStorage.removeItem(ENABLE_DARK_MODE);
      document.body.classList.remove("dark");
    }
  }
}
