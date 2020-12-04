import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  ChannelListResponse,
  ChannelReportResponse,
  StreamReportResponse,
  StreamListResponse,
} from "src/app/models";

import { ConfigService } from "./config.service";

const BASE_URL = "https://holo.poi.cat/api/v3";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  getYouTubeChannels(): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/youtube_channels`, {
      params: new HttpParams().set("ids", [...this.config.vtuber].join(",")),
    });
  }

  getBilibiliChannels(): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/bilibili_channels`, {
      params: new HttpParams().set("ids", [...this.config.vtuber].join(",")),
    });
  }

  getYouTubeStreams(
    ids: string[],
    options: { startAt?: Date; endAt?: Date } = {}
  ): Observable<StreamListResponse> {
    let params = new HttpParams().set("ids", ids.join(","));

    if (options.startAt) {
      params = params.set("startAt", options.startAt.toISOString());
    }

    if (options.endAt) {
      params = params.set("endAt", options.endAt.toISOString());
    }

    return this.http.get<StreamListResponse>(`${BASE_URL}/youtube_streams`, {
      params,
    });
  }

  getYouTubeScheduleStream(): Observable<StreamListResponse> {
    return this.http.get<StreamListResponse>(
      `${BASE_URL}/youtube_schedule_streams`,
      {
        params: new HttpParams().set("ids", [...this.config.vtuber].join(",")),
      }
    );
  }

  getChannelReport(
    ids: string,
    metrics: string,
    startAt: Date,
    endAt: Date
  ): Observable<ChannelReportResponse> {
    const params = new HttpParams({
      fromObject: {
        ids,
        metrics,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      },
    });

    return this.http.get<ChannelReportResponse>(`${BASE_URL}/channels_report`, {
      params,
    });
  }

  getStreamReport(
    ids: string,
    metrics: string = "youtube_stream_viewer",
    startAt?: Date,
    endAt?: Date
  ): Observable<StreamReportResponse> {
    let params = new HttpParams().set("ids", ids).set("metrics", metrics);

    if (startAt) {
      params = params.set("startAt", startAt.toISOString());
    }

    if (endAt) {
      params = params.set("endAt", endAt.toISOString());
    }

    return this.http.get<StreamReportResponse>(`${BASE_URL}/streams_report`, {
      params,
    });
  }
}
