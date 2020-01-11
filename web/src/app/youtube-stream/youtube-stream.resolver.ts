import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { StreamsList } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class YoutubeStreamResolver implements Resolve<StreamsList> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<StreamsList> {
    return this.apiService.getStreams();
  }
}
