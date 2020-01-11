import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";
import { fromEvent, Observable } from "rxjs";
import {
  map,
  distinctUntilChanged,
  debounceTime,
  filter
} from "rxjs/operators";

const icons: Array<{ name: string; svg: string }> = [
  {
    name: "chevron_right",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.6 7.4l4.6 4.6-4.6 4.6L10 18l6-6-6-6z"/></svg>'
  },
  {
    name: "expand_more",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.6 8.6L12 13.2 7.4 8.6 6 10l6 6 6-6-1.4-1.4z"/></svg>'
  },
  {
    name: "eye",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 5a7 7 0 016.4 4c-1.2 2.4-3.6 4-6.4 4s-5.2-1.6-6.4-4A7 7 0 019 5m0-1.4A8.6 8.6 0 001 9a8.6 8.6 0 0016 0 8.6 8.6 0 00-8-5.4zm0 3.6a1.8 1.8 0 010 3.6 1.8 1.8 0 010-3.6m0-1.5a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6z"/></svg>'
  },
  {
    name: "open_in_new",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7z"/></svg>'
  },
  {
    name: "menu",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"/></svg>'
  },
  {
    name: "quick_access",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6 4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6 4h4v-4h-4M4 8h4V4H4v4z"/></svg>'
  },
  {
    name: "theme",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18a6 6 0 01-2.5-.6 6 6 0 000-10.8A6 6 0 0112 6a6 6 0 016 6 6 6 0 01-6 6m8-9.3V4h-4.7L12 .7 8.7 4H4v4.7L.7 12 4 15.3V20h4.7l3.3 3.3 3.3-3.3H20v-4.7l3.3-3.3L20 8.7z"/></svg>'
  },
  {
    name: "youtube",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44a2.34 2.34 0 01-1.73-1.73c-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73a14.1 14.1 0 012.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>'
  },
  {
    name: "bilibili",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.1 6.4h-1l.9-1c.2-.2.3-.4.3-.8s-.1-.6-.3-.8-.5-.3-.8-.3-.6.1-.8.3l-2.7 2.6h-3.2L7.8 3.8c-.2-.2-.5-.3-.8-.3s-.6.1-.8.3-.3.5-.3.8 0 .6.3.8l.9 1H6a3.3 3.3 0 00-3.4 3.3V17c0 1 .3 1.8 1 2.5s1.4 1 2.3 1h12c1 0 1.7-.4 2.4-1s1-1.4 1-2.4V9.7c0-1-.3-1.7-1-2.3s-1.3-1-2.3-1h0zm1 10.6c0 .3-.2.6-.4.8s-.5.4-.9.4H6.2c-.4 0-.7-.1-.9-.4S5 17.3 5 17V9.9c0-.4 0-.7.3-.9s.5-.3.9-.3h11.6c.4 0 .7 0 1 .3s.2.5.3.9v7h0zM8.6 11c-.4 0-.6.2-.9.4s-.3.5-.3.9v1.2c0 .3.1.6.3.8s.5.4.9.4.6-.1.8-.4.4-.5.4-.8v-1.2c0-.4-.1-.6-.4-.9s-.5-.3-.8-.3h0zm7 0a1.3 1.3 0 00-1.2 1.2v1.3c0 .3 0 .6.3.8s.5.4.9.4.6-.1.8-.4.4-.5.4-.8v-1.2c0-.4-.2-.6-.4-.9s-.5-.3-.8-.3h0z"/></svg>'
  },
  {
    name: "timeline",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 14h.5l4.6-4.5a2 2 0 01.5-2 2 2 0 012.8 0c.5.6.7 1.3.5 2l2.6 2.6.5-.1h.5l3.6-3.5L19 8a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-.5l-3.6 3.5.1.5a2 2 0 01-2 2 2 2 0 01-2-2v-.5l-2.5-2.6h-1l-4.6 4.6.1.5a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2z"/></svg>'
  },
  {
    name: "stream",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 5a10 10 0 000 14l1.3-1.3a8 8 0 010-11.3L5 4.8m14.2 0l-1.4 1.4a8 8 0 010 11.4L19 19a10 10 0 000-14.2M7.8 7.8a6 6 0 000 8.4l1.4-1.4a4 4 0 010-5.6L7.8 7.8m8.4 0l-1.4 1.4a4 4 0 010 5.6l1.4 1.4a6 6 0 000-8.4M12 10a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2z"/></svg>'
  },
  {
    name: "tune",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3M3 5v2h10V5H3m10 16v-2h8v-2h-8v-2h-2v6h2M7 9v2H3v2h4v2h2V9H7m14 4v-2H11v2h10m-6-4h2V7h4V5h-4V3h-2v6z"/></svg>'
  }
];

@Component({
  selector: "hs-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  sidenavShouldOpen: boolean = true;
  sidenavMode: string = "side";
  isRouting$: Observable<boolean> = this.router.events.pipe(
    filter(
      event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
    ),
    map(event => event instanceof NavigationStart)
  );

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    for (const icon of icons) {
      this.iconRegistry.addSvgIconLiteral(
        icon.name,
        this.sanitizer.bypassSecurityTrustHtml(icon.svg)
      );
    }
  }

  ngOnInit() {
    this.updateSidenav(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(
        map(() => window.innerWidth),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(width => this.updateSidenav(width));
  }

  updateSidenav(width: number) {
    this.sidenavShouldOpen = width > 1200;
    this.sidenavMode = width > 1200 ? "side" : "over";
  }
}
