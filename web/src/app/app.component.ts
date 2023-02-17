import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { fromEvent, map, startWith, throttleTime } from "rxjs";

import { Header } from "./layout/header/header";
import { Sidenav } from "./layout/sidenav/sidenav";

const icons: Array<[string, string]> = [
  [
    "chevron_right",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.6 7.4l4.6 4.6-4.6 4.6L10 18l6-6-6-6z"/></svg>',
  ],
  [
    "chevron_down",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>',
  ],
  [
    "expand_more",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.6 8.6L12 13.2 7.4 8.6 6 10l6 6 6-6-1.4-1.4z"/></svg>',
  ],
  [
    "eye",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 5a7 7 0 016.4 4c-1.2 2.4-3.6 4-6.4 4s-5.2-1.6-6.4-4A7 7 0 019 5m0-1.4A8.6 8.6 0 001 9a8.6 8.6 0 0016 0 8.6 8.6 0 00-8-5.4zm0 3.6a1.8 1.8 0 010 3.6 1.8 1.8 0 010-3.6m0-1.5a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6z"/></svg>',
  ],
  [
    "open_in_new",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7z"/></svg>',
  ],
  [
    "menu",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"/></svg>',
  ],
  [
    "quick_access",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6 4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6 4h4v-4h-4M4 8h4V4H4v4z"/></svg>',
  ],
  [
    "theme",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18a6 6 0 01-2.5-.6 6 6 0 000-10.8A6 6 0 0112 6a6 6 0 016 6 6 6 0 01-6 6m8-9.3V4h-4.7L12 .7 8.7 4H4v4.7L.7 12 4 15.3V20h4.7l3.3 3.3 3.3-3.3H20v-4.7l3.3-3.3L20 8.7z"/></svg>',
  ],
  [
    "youtube",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44a2.34 2.34 0 01-1.73-1.73c-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73a14.1 14.1 0 012.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>',
  ],
  [
    "bilibili",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.1 6.4h-1l.9-1c.2-.2.3-.4.3-.8s-.1-.6-.3-.8-.5-.3-.8-.3-.6.1-.8.3l-2.7 2.6h-3.2L7.8 3.8c-.2-.2-.5-.3-.8-.3s-.6.1-.8.3-.3.5-.3.8 0 .6.3.8l.9 1H6a3.3 3.3 0 00-3.4 3.3V17c0 1 .3 1.8 1 2.5s1.4 1 2.3 1h12c1 0 1.7-.4 2.4-1s1-1.4 1-2.4V9.7c0-1-.3-1.7-1-2.3s-1.3-1-2.3-1h0zm1 10.6c0 .3-.2.6-.4.8s-.5.4-.9.4H6.2c-.4 0-.7-.1-.9-.4S5 17.3 5 17V9.9c0-.4 0-.7.3-.9s.5-.3.9-.3h11.6c.4 0 .7 0 1 .3s.2.5.3.9v7h0zM8.6 11c-.4 0-.6.2-.9.4s-.3.5-.3.9v1.2c0 .3.1.6.3.8s.5.4.9.4.6-.1.8-.4.4-.5.4-.8v-1.2c0-.4-.1-.6-.4-.9s-.5-.3-.8-.3h0zm7 0a1.3 1.3 0 00-1.2 1.2v1.3c0 .3 0 .6.3.8s.5.4.9.4.6-.1.8-.4.4-.5.4-.8v-1.2c0-.4-.2-.6-.4-.9s-.5-.3-.8-.3h0z"/></svg>',
  ],
  [
    "timeline",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 14h.5l4.6-4.5a2 2 0 01.5-2 2 2 0 012.8 0c.5.6.7 1.3.5 2l2.6 2.6.5-.1h.5l3.6-3.5L19 8a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-.5l-3.6 3.5.1.5a2 2 0 01-2 2 2 2 0 01-2-2v-.5l-2.5-2.6h-1l-4.6 4.6.1.5a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2z"/></svg>',
  ],
  [
    "stream",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 5a10 10 0 000 14l1.3-1.3a8 8 0 010-11.3L5 4.8m14.2 0l-1.4 1.4a8 8 0 010 11.4L19 19a10 10 0 000-14.2M7.8 7.8a6 6 0 000 8.4l1.4-1.4a4 4 0 010-5.6L7.8 7.8m8.4 0l-1.4 1.4a4 4 0 010 5.6l1.4 1.4a6 6 0 000-8.4M12 10a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2z"/></svg>',
  ],
  [
    "tune",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3M3 5v2h10V5H3m10 16v-2h8v-2h-8v-2h-2v6h2M7 9v2H3v2h4v2h2V9H7m14 4v-2H11v2h10m-6-4h2V7h4V5h-4V3h-2v6z"/></svg>',
  ],
  [
    "calendar",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path></svg>',
  ],
  [
    "refresh",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.6 6.3A8 8 0 0012 4a8 8 0 00-8 8 8 8 0 008 8 8 8 0 007.7-6h-2a6 6 0 01-5.7 4 6 6 0 01-6-6 6 6 0 016-6 6 6 0 014.2 1.8L13 11h7V4l-2.4 2.3z"/></svg>',
  ],
  [
    "translate",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.9 15l-2.6-2.4c1.8-2 3-4.2 3.8-6.6H17V4h-7V2H8v2H1v2h11.2c-.7 2-1.8 3.8-3.2 5.3-1-1-1.7-2.1-2.3-3.3h-2c.7 1.6 1.7 3.2 3 4.6l-5.1 5L4 19l5-5 3.1 3.1.8-2zm5.6-5h-2L12 22h2l1.1-3H20l1.1 3h2l-4.5-12zm-2.6 7l1.6-4.3 1.6 4.3H16z"/></svg>',
  ],
  [
    "more",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
  ],
  [
    "twitter",
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38c-.83.5-1.75.85-2.72 1.05a4.28 4.28 0 00-7.32 3.91A12.2 12.2 0 013 4.79a4.24 4.24 0 001.33 5.71c-.71 0-1.37-.2-1.95-.5v.03a4.3 4.3 0 003.44 4.21 4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.52 8.52 0 01-6.35 1.78A12.14 12.14 0 008.12 21C16 21 20.33 14.46 20.33 8.79l-.01-.56A8.57 8.57 0 0022.46 6z"/></svg>',
  ],
  [
    "playlist_add",
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><path d="M14,10H3v2h11V10z M14,6H3v2h11V6z M18,14v-4h-2v4h-4v2h4v4h2v-4h4v-2H18z M3,16h7v-2H3V16z"/></g></svg>',
  ],
  [
    "thumb_up",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13.11 5.72l-.57 2.89c-.12.59.04 1.2.42 1.66.38.46.94.73 1.54.73H20v1.08L17.43 18H9.34c-.18 0-.34-.16-.34-.34V9.82l4.11-4.1M14 2L7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.83C7 18.95 8.05 20 9.34 20h8.1c.71 0 1.36-.37 1.72-.97l2.67-6.15c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2zM4 9H2v11h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1z"/></svg>',
  ],
  [
    "sync_problem",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 12c0 2.21.91 4.2 2.36 5.64L3 20h6v-6l-2.24 2.24C5.68 15.15 5 13.66 5 12c0-2.61 1.67-4.83 4-5.65V4.26C5.55 5.15 3 8.27 3 12zm8 5h2v-2h-2v2zM21 4h-6v6l2.24-2.24C18.32 8.85 19 10.34 19 12c0 2.61-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74 0-2.21-.91-4.2-2.36-5.64L21 4zm-10 9h2V7h-2v6z"/></svg>',
  ],
  [
    "sync",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>',
  ],
  [
    "check_circle",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>',
  ],
  [
    "arrow_circle_down",
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/><path d="M12,4c4.41,0,8,3.59,8,8s-3.59,8-8,8s-8-3.59-8-8S7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10 c5.52,0,10-4.48,10-10C22,6.48,17.52,2,12,2L12,2z M13,12l0-4h-2l0,4H8l4,4l4-4H13z"/></g></svg>',
  ],
  [
    "information_outline",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>information-outline</title><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" /></svg>',
  ],
];

@Component({
  standalone: true,
  imports: [Header, Sidenav, RouterModule, MatSidenavModule],
  selector: "hls-root",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
  sidenavShouldOpen = false;
  sidenavMode: string = "side";

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    for (const [name, svg] of icons) {
      this.iconRegistry.addSvgIconLiteral(
        name,
        this.sanitizer.bypassSecurityTrustHtml(svg)
      );
    }
  }

  ngOnInit() {
    if (typeof window !== "undefined") {
      fromEvent(window, "resize")
        .pipe(
          throttleTime(500),
          startWith(window.innerWidth),
          map(() => window.innerWidth)
        )
        .subscribe((width) => this.updateSidenav(width));
    }
  }

  updateSidenav(width: number) {
    this.sidenavShouldOpen = width > 1200;
    this.sidenavMode = width > 1200 ? "side" : "over";
  }
}
