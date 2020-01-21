import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { StreamsResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class YoutubeStreamResolver implements Resolve<StreamsResponse> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<StreamsResponse> {
    return this.apiService.getYouTubeStreams(new Date(0), new Date());
  }
}
