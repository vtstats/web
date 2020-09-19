// this component is used as the index of service worker,
// it can prevents sw from caching server-side rendered pages

import { Component, OnInit, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "hs-app-shell",
  template: "",
})
export class AppShellComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platform: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.router.navigateByUrl("/", { replaceUrl: true });
    }
  }
}
