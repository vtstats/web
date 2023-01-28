import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Observable } from "rxjs";
import {
  YouTubeAddPlaylistItemResponse,
  YouTubePlaylistResponse,
} from "src/app/models";
import { environment } from "src/environments/environment";

const init = () =>
  new Promise((resolve, reject) => {
    if (window.gapi) {
      return window.gapi.load("auth2", {
        callback: () =>
          window.gapi.auth2
            .init({
              client_id: environment.yt_client_id,
              scope: "profile email https://www.googleapis.com/auth/youtube",
            })
            .then(resolve, reject),
        onerror: reject,
      });
    }

    const s = document.createElement("script");
    s.src = "https://apis.google.com/js/api.js";
    s.async = true;
    s.onload = () =>
      window.gapi.load("auth2", {
        callback: () =>
          window.gapi.auth2
            .init({
              client_id: environment.yt_client_id,
              scope: "profile email https://www.googleapis.com/auth/youtube",
            })
            .then(resolve, reject),
        onerror: reject,
      });
    s.onerror = reject;
    document.body.appendChild(s);
  });

type SignedInUser = {
  name: string;
  email: string;
  imageUrl: string;
};

@Injectable({ providedIn: "root" })
export class GoogleApiService {
  user$ = new BehaviorSubject<SignedInUser | null>(null);

  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    init().then((auth: gapi.auth2.GoogleAuth) => {
      this.updateSignInStatus(auth.currentUser.get());
      auth.currentUser.listen((user) => this.updateSignInStatus(user));
    });
  }

  private updateSignInStatus(user: gapi.auth2.GoogleUser) {
    this.ngZone.runTask(() => {
      if (user && user.isSignedIn()) {
        const profile = user.getBasicProfile();
        this.user$.next({
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl(),
          name: profile.getName(),
        });
      } else {
        this.user$.next(null);
      }
    });
  }

  async signIn() {
    return gapi.auth2
      .getAuthInstance()
      .signIn({ ux_mode: "popup" })
      .catch((err) => {
        this.snackBar.open(`Failed to sign in: ${err?.error}`, undefined, {
          duration: 3000, // 3s
        });
      });
  }

  async signOut() {
    return gapi.auth2.getAuthInstance().signOut();
  }

  listPlaylist(): Observable<YouTubePlaylistResponse> {
    return this.http.get<YouTubePlaylistResponse>(
      "https://youtube.googleapis.com/youtube/v3/playlists",
      {
        headers: {
          Authorization:
            "Bearer " +
            gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true)
              .access_token,
        },
        params: new HttpParams()
          .set("mine", "true")
          .set("part", "snippet,contentDetails,id,localizations,status")
          .set("maxResults", "50"),
      }
    );
  }

  addToPlaylist(playlistId: string, videoId: string) {
    return this.http.post<YouTubeAddPlaylistItemResponse>(
      "https://youtube.googleapis.com/youtube/v3/playlistItems",
      {
        snippet: {
          playlistId,
          position: 0,
          resourceId: { kind: "youtube#video", videoId },
        },
      },
      {
        headers: {
          Authorization:
            "Bearer " +
            gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true)
              .access_token,
        },
        params: new HttpParams().set("part", "snippet"),
      }
    );
  }
}
