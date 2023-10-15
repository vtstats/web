import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ResizeService {
  constructor() {
    if (typeof window !== "undefined") {
      let timer: any = null;

      window.addEventListener("resize", () => {
        if (!timer) this.update();

        clearTimeout(timer);

        timer = setTimeout(() => {
          this.update();
          timer = null;
        }, 500);
      });

      this.update();
    }
  }

  update = () => this.windowWidth.set(window.innerWidth);

  windowWidth = signal(2434);
}
