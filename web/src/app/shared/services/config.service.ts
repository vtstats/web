import { Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Subject } from "rxjs";

import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "src/utils";
import { vtubers } from "vtubers";

@Injectable({ providedIn: "root" })
export class ConfigService implements OnDestroy {
  vtuber: Set<string>;
  playlist: string;
  timezone$ = new BehaviorSubject(this.getItem("timezone"));

  snackBar$ = null;

  private onDestroy = new Subject<void>();

  constructor(private snackBar: MatSnackBar) {
    const vtbString = this.getItem("vtuber");
    if (vtbString) {
      this.vtuber = new Set(vtbString.split(",").filter((id) => id in vtubers));
    } else {
      this.vtuber = new Set(
        Object.values(vtubers)
          .filter((v) => v.default)
          .map((v) => v.id)
      );
    }

    this.playlist = this.getItem("yt_playlist");
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  addVtubers(ids: string[]) {
    for (const id of ids) {
      this.vtuber.add(id);
    }
    this.setItem("vtuber", [...this.vtuber].join(","));
  }

  deleteVTubers(ids: string[]) {
    for (const id of ids) {
      this.vtuber.delete(id);
    }
    this.setItem("vtuber", [...this.vtuber].join(","));
  }

  setLang(newLang: string) {
    this.setItem("lang", newLang);
    location.reload();
  }

  setTimezone(item: string) {
    this.timezone$.next(item);

    if (!this.snackBar$) {
      this.snackBar$ = this.snackBar
        .open("Reload page to take effect", "RELOAD")
        .onAction()
        .subscribe(() => location.reload());
    }

    if (item) {
      this.setItem("timezone", item);
    } else {
      this.removeItem("timezone");
    }
  }

  setPlaylist(item: string) {
    this.playlist = item;
    this.setItem("yt_playlist", item);
  }

  private removeItem(key: string) {
    return removeLocalStorage(key);
  }

  private getItem(key: string) {
    return getLocalStorage(key);
  }

  private setItem(key: string, value: string) {
    return setLocalStorage(key, value);
  }
}
