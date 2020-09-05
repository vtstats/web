import { Injectable } from "@angular/core";

import { vtubers } from "vtubers";

const defaultSelectedVTubers: string[] = Object.values(vtubers)
  .filter((v) => v.default)
  .map((v) => v.id);

export const ENABLE_DARK_MODE = "holostats:enableDarkMode";
export const SELECTED_VTUBERS = "holostats:selectedVTubers";

@Injectable({ providedIn: "root" })
export class Config {
  selectedVTubers: Set<String> = new Set(
    localStorage
      .getItem(SELECTED_VTUBERS)
      ?.split(",")
      .filter((id) => Object.keys(vtubers).includes(id)) ??
      defaultSelectedVTubers
  );

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
