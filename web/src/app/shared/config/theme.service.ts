import { DOCUMENT } from "@angular/common";
import { inject, Injectable, OnDestroy } from "@angular/core";

import {
  combineLatest,
  map,
  Observable,
  shareReplay,
  Subject,
  Subscription,
} from "rxjs";
import { fromMediaMatch } from "./media";
import { StorageSubject } from "./storage";

export type ThemeSetting = "light" | "dark" | "follow-system";

@Injectable({
  providedIn: "root",
})
export class ThemeService implements OnDestroy {
  private document = inject(DOCUMENT);

  themeSetting$: Subject<ThemeSetting>;

  prefersDarkMode$: Observable<boolean>;

  theme$: Observable<string>;

  isDarkTheme$: Observable<boolean>;

  _sub: Subscription;

  constructor() {
    this.themeSetting$ = new StorageSubject<ThemeSetting>(
      "vts:themeSetting",
      "follow-system"
    );

    this.prefersDarkMode$ = fromMediaMatch("(prefers-color-scheme: dark)");

    this.theme$ = combineLatest({
      themeSetting: this.themeSetting$,
      prefersDarkMode: this.prefersDarkMode$,
    }).pipe(
      map(({ themeSetting, prefersDarkMode }) => {
        if (
          themeSetting === "dark" ||
          (themeSetting === "follow-system" && prefersDarkMode)
        ) {
          return "dark";
        }

        return "light";
      }),
      shareReplay(1)
    );

    this.isDarkTheme$ = this.theme$.pipe(map((t) => t === "dark"));

    this._sub = this.isDarkTheme$.subscribe((isDarkTheme) => {
      this.document.body.setAttribute("class", isDarkTheme ? "dark" : "light");
      this.document.head
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", isDarkTheme ? "#282828" : "#FFFFFF");
    });
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
