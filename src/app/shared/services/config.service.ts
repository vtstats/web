import { Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Subject, Subscription } from "rxjs";

import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "src/utils";

@Injectable({ providedIn: "root" })
export class ConfigService implements OnDestroy {
  playlist: string | null;
  timezone$ = new BehaviorSubject<string | null>(
    getLocalStorage("timezone", null),
  );

  snackBar$: Subscription | null = null;

  private onDestroy = new Subject<void>();

  constructor(private snackBar: MatSnackBar) {
    this.playlist = getLocalStorage("yt_playlist", null);
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

  private setItem(key: string, value: string) {
    return setLocalStorage(key, value);
  }
}
