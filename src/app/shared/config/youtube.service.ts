import { ApplicationRef, Injectable, NgZone } from "@angular/core";
import { addSeconds, isPast } from "date-fns";
import qs from "query-string";
import {
  BehaviorSubject,
  defer,
  filter,
  mergeMap,
  Observable,
  ReplaySubject,
  tap,
} from "rxjs";
import { fromFetch } from "rxjs/fetch";

import { YouTubeAddPlaylistItemResponse } from "src/app/models";
import { environment } from "src/environments/environment";
import { StorageSubject } from "./storage";

export type GoogleUser = {
  email: string;
  name: string;
  picture: string;
};

@Injectable({ providedIn: "root" })
export class GoogleService {
  user$ = new StorageSubject<GoogleUser | null>("vts:googleUser", null);

  client?: google.accounts.oauth2.TokenClient;

  private tokenSub = new BehaviorSubject<[string, Date] | null>(null);

  token$ = defer(() => {
    const value = this.tokenSub.getValue();

    if (!value || isPast(value[1])) {
      this.client?.requestAccessToken();
      this.tokenSub.next(null);
    }

    return this.tokenSub.asObservable();
  }).pipe(filter(Boolean));

  initialized$ = new ReplaySubject<boolean>();

  constructor(
    private ngZone: NgZone,
    private cdr: ApplicationRef,
  ) {
    // for ssr
    if (typeof window === "undefined") return;

    this.ngZone.runOutsideAngular(() => {
      if (window.google && window.google.accounts) {
        this.init();
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => this.init();
      document.head.appendChild(script);
    });
  }

  init() {
    window.google.accounts.id.initialize({
      client_id: environment.youtubeClientId,
      callback: (res) => {
        try {
          const base64Url = res.credential.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map(
                (chart) =>
                  "%" + ("00" + chart.charCodeAt(0).toString(16)).slice(-2),
              )
              .join(""),
          );
          const parsed: GoogleUser = JSON.parse(jsonPayload);
          this.user$.next({
            email: parsed.email,
            name: parsed.name,
            picture: parsed.picture,
          });
        } catch (e) {
          console.error(e);
          this.user$.error(e);
        }
        this.cdr.tick();
      },
    });

    this.client = window.google.accounts.oauth2.initTokenClient({
      client_id: environment.youtubeClientId,
      prompt: "",
      scope: "https://www.googleapis.com/auth/youtube",
      callback: (res) => {
        if (res.error) {
          this.tokenSub.error(res.error);
        } else {
          this.tokenSub.next([
            res.access_token,
            addSeconds(Date.now(), +res.expires_in),
          ]);
        }
        this.cdr.tick();
      },
    });

    this.initialized$.next(true);
    this.cdr.tick();
  }

  logout() {
    this.user$.remove();
    const value = this.tokenSub.getValue();
    if (value) {
      window.google.accounts.oauth2.revoke(value[0], () => {});
    }
    this.cdr.tick();
  }

  listPlaylist() {
    return this.token$.pipe(
      mergeMap(([token]) =>
        fromFetch(
          qs.stringifyUrl(
            {
              url: "https://youtube.googleapis.com/youtube/v3/playlists",
              query: {
                mine: "true",
                part: [
                  "snippet",
                  "contentDetails",
                  "id",
                  "localizations",
                  "status",
                ],
                maxResults: "50",
              },
            },
            { arrayFormat: "comma" },
          ),
          {
            selector: (res) => res.json(),
            headers: { Authorization: "Bearer " + token },
          },
        ),
      ),
      tap(console.log),
    );
  }

  addToPlaylist(
    playlistId: string,
    videoId: string,
  ): Observable<YouTubeAddPlaylistItemResponse> {
    return this.token$.pipe(
      mergeMap(([token]) =>
        fromFetch(
          qs.stringifyUrl({
            url: "https://youtube.googleapis.com/youtube/v3/playlistItems",
            query: { part: "snippet" },
          }),
          {
            method: "POST",
            selector: (res) => res.json(),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              snippet: {
                playlistId,
                position: 0,
                resourceId: { kind: "youtube#video", videoId },
              },
            }),
          },
        ),
      ),
    );
  }
}
