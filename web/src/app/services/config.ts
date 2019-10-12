import { Injectable } from "@angular/core";

const defaultSelectedVTubers = [
  "aki",
  "aqua",
  "ayame",
  "azki",
  "choco",
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
  "yogiri"
];

const defaultSelectedColumns = [
  "profile",
  "name",
  "youtubeSubs",
  "youtubeDailySubs",
  "youtubeWeeklySubs",
  "youtubeViews",
  "youtubeDailyViews",
  "youtubeWeeklyViews",
  "bilibiliSubs",
  "bilibiliDailySubs",
  "bilibiliWeeklySubs",
  "bilibiliViews",
  "bilibiliDailyViews",
  "bilibiliWeeklyViews"
];

export const ENABLE_DARK_MODE = "holostats:enableDarkMode";
export const SELECTED_COLUMNS = "holostats:selectedColumns";
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

  private selectedColumns_ = localStorage.getItem(SELECTED_COLUMNS)
    ? localStorage.getItem(SELECTED_COLUMNS).split(",")
    : defaultSelectedColumns;

  get selectedColumns(): string[] {
    return this.selectedColumns_;
  }

  removeColumns(column: string) {
    this.selectedColumns_ = this.selectedColumns_.filter(col => col !== column);
    localStorage.setItem(SELECTED_COLUMNS, this.selectedColumns_.join(","));
  }

  addColumns(column: string) {
    this.selectedColumns_.push(column);
    this.selectedColumns_.sort(
      (a, b) =>
        defaultSelectedColumns.indexOf(a) - defaultSelectedColumns.indexOf(b)
    );
    localStorage.setItem(SELECTED_COLUMNS, this.selectedColumns_.join(","));
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
