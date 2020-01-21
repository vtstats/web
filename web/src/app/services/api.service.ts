import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  ChannelsResponse,
  VTuberResponse,
  StreamsResponse,
  StreamResponse
} from "../models";
import { Config } from "./config";

const BASE_URL = "https://holo.poi.cat/api_v2";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient, private config: Config) {}

  getYouTubeChannels(): Observable<ChannelsResponse> {
    return this.http.get<ChannelsResponse>(`${BASE_URL}/youtube_channel`, {
      params: new HttpParams({
        fromObject: { ids: this.config.joinedSelectedVTubers }
      })
    });
  }

  getBilibiliChannels(): Observable<ChannelsResponse> {
    return this.http.get<ChannelsResponse>(`${BASE_URL}/bilibili_channel`, {
      params: new HttpParams({
        fromObject: { ids: this.config.joinedSelectedVTubers }
      })
    });
  }

  getVTuber(
    id: string,
    startAt: Date,
    endAt: Date
  ): Observable<VTuberResponse> {
    return this.http.get<VTuberResponse>(`${BASE_URL}/vtuber/${id}`, {
      params: new HttpParams({
        fromObject: {
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString()
        }
      })
    });
  }

  getYouTubeStreams(startAt: Date, endAt: Date): Observable<StreamsResponse> {
    return this.http.get<StreamsResponse>(`${BASE_URL}/youtube_stream`, {
      params: new HttpParams({
        fromObject: {
          ids: this.config.joinedSelectedVTubers,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString()
        }
      })
    });
  }

  getStream(id: string): Observable<StreamResponse> {
    return this.http.get<StreamResponse>(`${BASE_URL}/stream/${id}`);
  }
}
