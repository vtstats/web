import { DOCUMENT } from "@angular/common";
import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { getLocalStorage, setLocalStorage } from "src/utils";
import { fromMediaMatch } from "./media";

export type ThemeSetting = "light" | "dark" | "followSystem";

const storageKey = "vts:themeSetting";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private document = inject(DOCUMENT);

  themeSetting = signal<ThemeSetting>(
    getLocalStorage(storageKey, "followSystem")
  );

  themeSettingEffect = effect(() => {
    setLocalStorage(storageKey, this.themeSetting());
  });

  prefersDarkMode = toSignal(
    fromMediaMatch("(prefers-color-scheme: dark)", true)
  );

  theme = computed(() => {
    const themeSetting = this.themeSetting();
    const prefersDarkMode = this.prefersDarkMode();

    if (themeSetting === "followSystem") {
      return prefersDarkMode ? "dark" : "light";
    }

    return themeSetting;
  });

  themeEffect = effect(() => {
    const theme = this.theme();

    this.document.body.setAttribute("class", theme);
    this.document.head
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#282828" : "#FFFFFF");
  });
}
