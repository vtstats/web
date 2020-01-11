import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { VTubersList } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class YoutubeChannelResolver implements Resolve<VTubersList> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<VTubersList> {
    return this.apiService.getVTubers();
  }
}
