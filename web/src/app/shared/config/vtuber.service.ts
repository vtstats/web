import { Injectable } from "@angular/core";
import { getLocalStorage, setLocalStorage } from "src/utils";
import { StorageSubject } from "./storage";

export type VTuber = {
  id: string;
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  default?: true;
  native_name: string;
  japanese_name: string;
  english_name: string;
};

export type Batch = {
  id: string;
  native_name: string;
  japanese_name: string;
  english_name: string;
  children: string[];
};

@Injectable({ providedIn: "root" })
export class VTuberService {
  selected = new Set<string>();
  vtubers: Record<string, VTuber> = {};
  batches: Record<string, Batch> = {};

  nameSettings$ = new StorageSubject<string>("vts:nameSetting", "english_name");

  async initialize() {
    const mod = await import("../../../../vtubers");
    this.vtubers = mod.vtubers.reduce((acc, v) => {
      acc[v.id] = v;
      return acc;
    }, {});
    this.batches = mod.batches.reduce((acc, v) => {
      acc[v.id] = v;
      return acc;
    }, {});

    // TODO: use StorageSubject to manage
    const vtbString = getLocalStorage("vtuber");
    if (vtbString) {
      this.selected = new Set(
        vtbString.split(",").filter((id) => id in this.vtubers)
      );
    } else {
      this.selected = new Set(
        Object.values(this.vtubers)
          .filter((v) => v.default)
          .map((v) => v.id)
      );
    }
  }

  getName(id: string): string {
    const item = this.vtubers[id] || this.batches[id];

    if (!item) return null;

    const key = this.nameSettings$.getValue();

    return item[key];
  }

  addVtubers(ids: string[]) {
    for (const id of ids) {
      this.selected.add(id);
    }
    setLocalStorage("vtuber", [...this.selected].join(","));
  }

  deleteVTubers(ids: string[]) {
    for (const id of ids) {
      this.selected.delete(id);
    }
    setLocalStorage("vtuber", [...this.selected].join(","));
  }

  findVTuberById(id: string): VTuber | null {
    return this.vtubers[id];
  }
}
