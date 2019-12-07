import { Injectable } from "@angular/core";

const defaultSelectedVTubers = [
  "aki",
  "aqua",
  "ayame",
  "azki",
  "choco",
  "choco_alt",
  "flare",
  "fubuki",
  "haato",
  "hololive",
  "korone",
  "marine",
  "matsuri",
  "mel",
  "miko",
  "mio",
  "nana",
  "noel",
  "okayu",
  "pekora",
  "roboco",
  "rushia",
  "shion",
  "sora",
  "subaru",
  "suisei",
  "ui",
  "yogiri",
  "civia",
  "echo"
];

export const ENABLE_DARK_MODE = "holostats:enableDarkMode";
export const SELECTED_VTUBERS = "holostats:selectedVTubers";

@Injectable({ providedIn: "root" })
export class Config {
  private selectedVTubers_ = localStorage.getItem(SELECTED_VTUBERS)
    ? localStorage.getItem(SELECTED_VTUBERS).split(",")
    : defaultSelectedVTubers;

  get selectedVTubers() {
    return this.selectedVTubers_;
  }

  set selectedVTubers(vtubers: string[]) {
    let filteredVTubers = vtubers.filter(
      (id, i, vtubers) => vtubers.indexOf(id) === i
    );
    localStorage.setItem(SELECTED_VTUBERS, filteredVTubers.join(","));
    this.selectedVTubers_ = filteredVTubers;
  }

  private enableDarkMode_ = localStorage.getItem(ENABLE_DARK_MODE) !== null;

  get enableDarkMode(): boolean {
    return this.enableDarkMode_;
  }

  set enableDarkMode(value: boolean) {
    if (value) {
      localStorage.setItem(ENABLE_DARK_MODE, "t");
      document.body.classList.add("dark");
    } else {
      localStorage.removeItem(ENABLE_DARK_MODE);
      document.body.classList.remove("dark");
    }
    this.enableDarkMode_ = value;
  }
}
