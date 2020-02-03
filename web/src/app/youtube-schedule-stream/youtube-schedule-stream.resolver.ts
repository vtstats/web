import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { StreamListResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class YoutubeSchduleStreamResolver
  implements Resolve<StreamListResponse> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<StreamListResponse> {
    return this.apiService.getYouTubeScheduleStream();
  }
}
