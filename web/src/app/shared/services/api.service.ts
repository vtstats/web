import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  ChannelListOption,
  ChannelListResponse,
  ChannelListResponseEX,
  ChannelReportOption,
  ChannelReportResponse,
  StreamListOption,
  StreamListResponse,
  StreamReportOption,
  StreamReportResponse,
} from "src/app/models";

const BASE_URL = "https://taiwanv.linnil1.me/api/v4";
// const BASE_URL = "http://localhost:4200/api/v4";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  youtubeChannels(opts: ChannelListOption): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/youtube_channels`, {
      params: new HttpParams().set("ids", opts.ids.join(",")),
    });
  }

  youtubeChannelsEX(
    opts: ChannelListOption
  ): Observable<ChannelListResponseEX> {
    return this.http.get<ChannelListResponseEX>(
      `${BASE_URL}/youtube_channels_ex`,
      {
        params: new HttpParams().set("ids", opts.ids.join(",")),
      }
    );
  }

  bilibiliChannels(opts: ChannelListOption): Observable<ChannelListResponse> {
    return this.http.get<ChannelListResponse>(`${BASE_URL}/bilibili_channels`, {
      params: new HttpParams().set("ids", opts.ids.join(",")),
    });
  }

  youtubeStreams(opts: StreamListOption): Observable<StreamListResponse> {
    let params = new HttpParams()
      .set("ids", opts.ids.join(","))
      .set("status", opts.status.join(","));

    if (opts.orderBy) {
      params = params.set("orderBy", opts.orderBy);
    }

    if (opts.startAt) {
      params = params.set("startAt", Number(opts.startAt).toString());
    }

    if (opts.endAt) {
      params = params.set("endAt", Number(opts.endAt).toString());
    }

    return this.http.get<StreamListResponse>(`${BASE_URL}/youtube_streams`, {
      params,
    });
  }

  channelReports(opts: ChannelReportOption): Observable<ChannelReportResponse> {
    let params = new HttpParams()
      .set("ids", opts.ids.join(","))
      .set("metrics", opts.metrics.join(","));

    if (opts.startAt) {
      params = params.set("startAt", Number(opts.startAt).toString());
    }

    if (opts.endAt) {
      params = params.set("endAt", Number(opts.endAt).toString());
    }

    return this.http.get<ChannelReportResponse>(`${BASE_URL}/channels_report`, {
      params,
    });
  }

  streamReports(opts: StreamReportOption): Observable<StreamReportResponse> {
    let params = new HttpParams()
      .set("ids", opts.ids.join(","))
      .set("metrics", opts.metrics.join(","));

    if (opts.startAt) {
      params = params.set("startAt", Number(opts.startAt).toString());
    }

    if (opts.endAt) {
      params = params.set("endAt", Number(opts.endAt).toString());
    }

    return this.http.get<StreamReportResponse>(`${BASE_URL}/streams_report`, {
      params,
    });
  }
}
