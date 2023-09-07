import { Injectable, computed, signal } from "@angular/core";
import { MatDrawerMode } from "@angular/material/sidenav";

@Injectable({ providedIn: "root" })
export class ResizeService {
  constructor() {
    if (typeof window !== "undefined") {
      let timer = null;

      window.addEventListener("resize", () => {
        if (!timer) this.windowWidth.set(window.innerWidth);

        clearTimeout(timer);

        timer = setTimeout(() => {
          this.windowWidth.set(window.innerWidth);
          timer = null;
        }, 500);
      });
    }
  }

  windowWidth = signal(2434);

  sidenavOpened = computed(() => this.windowWidth() > 1200);

  sidenavMode = computed<MatDrawerMode>(() =>
    this.windowWidth() > 1200 ? "side" : "over"
  );

  sidenavFixedTopGap = computed(() => (this.windowWidth() > 1200 ? 65 : 0));
}
