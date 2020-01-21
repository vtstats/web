import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { ChannelsResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class BilibiliChannelResolver implements Resolve<ChannelsResponse> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<ChannelsResponse> {
    return this.apiService.getBilibiliChannels();
  }
}
