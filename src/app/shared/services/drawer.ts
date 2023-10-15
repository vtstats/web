import { Injectable, computed, inject } from "@angular/core";
import { MatDrawerMode, MatSidenav } from "@angular/material/sidenav";

import { ResizeService } from "./resize.service";

@Injectable({ providedIn: "root" })
export class DrawerService {
  drawer: MatSidenav | null = null;
  resizeService = inject(ResizeService);

  setDrawer(drawer: MatSidenav) {
    this.drawer = drawer;
  }

  sidenavOpen = computed(() => this.resizeService.windowWidth() > 1200);

  sidenavMode = computed<MatDrawerMode>(() =>
    this.sidenavOpen() ? "side" : "over"
  );

  sidenavFixedTopGap = computed(() => (this.sidenavOpen() ? 65 : 0));

  toggle() {
    this.drawer?.toggle();
  }
}
