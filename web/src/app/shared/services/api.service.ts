import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  ChannelListOption,
  ChannelListResponse,
  ChannelReportOption,
  ChannelReportResponse,
  StreamListOption,
  StreamListResponse,
  StreamReportOption,
  StreamReportResponse,
} from "src/app/models";

const BASE_URL = "https://holo.poi.cat/api/v4";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  youtubeChannels(option: ChannelListOption): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/youtube_channels`, {
      params: new HttpParams().set("ids", option.ids.join(",")),
    });
  }

  bilibiliChannels(option: ChannelListOption): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/bilibili_channels`, {
      params: new HttpParams().set("ids", option.ids.join(",")),
    });
  }

  youtubeStreams(option: StreamListOption): Observable<StreamListResponse> {
    let params = new HttpParams()
      .set("ids", option.ids.join(","))
      .set("status", option.status.join(","));

    if (option.orderBy) {
      params = params.set("orderBy", option.orderBy);
    }

    if (option.startAt) {
      params = params.set("startAt", Number(option.startAt).toString());
    }

    if (option.endAt) {
      params = params.set("endAt", Number(option.endAt).toString());
    }

    return this.http.get<StreamListResponse>(`${BASE_URL}/youtube_streams`, {
      params,
    });
  }

  channelReports(
    option: ChannelReportOption
  ): Observable<ChannelReportResponse> {
    let params = new HttpParams()
      .set("ids", option.ids.join(","))
      .set("metrics", option.metrics.join(","));

    if (option.startAt) {
      params = params.set("startAt", Number(option.startAt).toString());
    }

    if (option.endAt) {
      params = params.set("endAt", Number(option.endAt).toString());
    }

    return this.http.get<ChannelReportResponse>(`${BASE_URL}/channels_report`, {
      params,
    });
  }

  streamReports(option: StreamReportOption): Observable<StreamReportResponse> {
    let params = new HttpParams()
      .set("ids", option.ids.join(","))
      .set("metrics", option.metrics.join(","));

    if (option.startAt) {
      params = params.set("startAt", Number(option.startAt).toString());
    }

    if (option.endAt) {
      params = params.set("endAt", Number(option.endAt).toString());
    }

    return this.http.get<StreamReportResponse>(`${BASE_URL}/streams_report`, {
      params,
    });
  }
}
