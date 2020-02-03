import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { ChannelListResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class BilibiliChannelResolver implements Resolve<ChannelListResponse> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<ChannelListResponse> {
    return this.apiService.getBilibiliChannels();
  }
}
