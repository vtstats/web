import { Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Subject } from "rxjs";

import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "src/utils";

@Injectable({ providedIn: "root" })
export class ConfigService implements OnDestroy {
  playlist: string;
  timezone$ = new BehaviorSubject(this.getItem("timezone"));

  snackBar$ = null;

  private onDestroy = new Subject<void>();

  constructor(private snackBar: MatSnackBar) {
    this.playlist = this.getItem("yt_playlist");
  }

  ngOnDestroy() {
    this.onDestroy.next();
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
