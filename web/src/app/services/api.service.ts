import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Dayjs } from "dayjs";

import {
  ChannelListResponse,
  ChannelReportResponse,
  StreamReportResponse,
  StreamListResponse,
} from "src/app/models";
import { Config } from "./config";

const BASE_URL = "/api/v3";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient, private config: Config) {}

  getYouTubeChannels(): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/youtube_channels`, {
      params: new HttpParams().set("ids", this.config.joinedSelectedVTubers),
    });
  }

  getBilibiliChannels(): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/bilibili_channels`, {
      params: new HttpParams().set("ids", this.config.joinedSelectedVTubers),
    });
  }

  getYouTubeStreams(
    startAt: Dayjs,
    endAt: Dayjs
  ): Observable<StreamListResponse> {
    return this.http.get<StreamListResponse>(`${BASE_URL}/youtube_streams`, {
      params: new HttpParams()
        .set("ids", this.config.joinedSelectedVTubers)
        .set("startAt", startAt.toISOString())
        .set("endAt", endAt.toISOString()),
    });
  }

  getYouTubeScheduleStream(): Observable<StreamListResponse> {
    return this.http.get<StreamListResponse>(
      `${BASE_URL}/youtube_schedule_streams`,
      {
        params: new HttpParams().set("ids", this.config.joinedSelectedVTubers),
      }
    );
  }

  getChannelReport(
    ids: string,
    metrics: string,
    startAt: Dayjs,
    endAt: Dayjs
  ): Observable<ChannelReportResponse> {
    return this.http.get<ChannelReportResponse>(`${BASE_URL}/channels_report`, {
      params: new HttpParams()
        .set("ids", ids)
        .set("metrics", metrics)
        .set("startAt", startAt.toISOString())
        .set("endAt", endAt.toISOString()),
    });
  }

  getStreamReport(
    ids: string,
    metrics: string = "youtube_stream_viewer",
    startAt?: Dayjs,
    endAt?: Dayjs
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
