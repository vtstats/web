import { Injectable, Inject, NgZone, OnDestroy } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Observer,
  skip,
  startWith,
  Subject,
  takeUntil,
} from "rxjs";

import { vtubers } from "vtubers";
import { MediaMatcher } from "@angular/cdk/layout";

@Injectable({ providedIn: "root" })
export class ConfigService implements OnDestroy {
  vtuber: Set<string>;
  playlist: string;
  timezone$ = new BehaviorSubject(window.localStorage.getItem("timezone"));

  snackBar$ = null;

  public theme$: BehaviorSubject<"light" | "dark" | "system">;

  private onDestroy = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private snackBar: MatSnackBar,
    private mediaMatcher: MediaMatcher,
    private _zone: NgZone
  ) {
    const vtbString = window.localStorage.getItem("vtuber");
    if (vtbString) {
      this.vtuber = new Set(vtbString.split(",").filter((id) => id in vtubers));
    } else {
      this.vtuber = new Set(
        Object.values(vtubers)
          .filter((v) => v.default)
          .map((v) => v.id)
      );
    }

    // theme settings
    {
      const storeKey = "theme";

      const query = this.mediaMatcher.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      const prefersDarkMode$ = new Observable(
        (observer: Observer<MediaQueryListEvent>) => {
          const handler = (e: MediaQueryListEvent) =>
            this._zone.run(() => observer.next(e));
          query.addEventListener("change", handler);
          return () => {
            query.removeEventListener("change", handler);
          };
        }
      ).pipe(
        takeUntil(this.onDestroy),
        map((ev) => ev.matches),
        startWith(query.matches)
      );

      const theme = window.localStorage.getItem(storeKey);
      this.theme$ = new BehaviorSubject(
        // prettier-ignore
        (!theme || theme === "system")
          ? "system"
          : (theme === "dark" ? "dark" : "light")
      );

      combineLatest([
        // BehaviorSubject emits immediately
        this.theme$.pipe(takeUntil(this.onDestroy), skip(1)),
        prefersDarkMode$,
      ]).subscribe(([theme, prefersDarkMode]) => {
        const isDarkMode =
          theme === "dark" || (theme === "system" && prefersDarkMode);
        this.document.body.setAttribute("class", isDarkMode ? "dark" : "light");
        this.document.head
          .querySelector('meta[name="theme-color"]')
          .setAttribute("content", isDarkMode ? "#282828" : "#FFFFFF");
        window.localStorage.setItem(storeKey, theme);
      });
    }

    this.playlist = window.localStorage.getItem("yt_playlist");
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
      window.localStorage.removeItem("timezone");
    }
  }

  setPlaylist(item: string) {
    this.playlist = item;
    this.setItem("yt_playlist", item);
  }

  private setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }
}
