import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  StreamDetailResponse,
  StreamsListResponse,
  VTubersListResponse,
  VTuberDetailResponse
} from "@holostats/libs/models";

const BASE_URL = "https://holo.poi.cat/api";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  getVTubers(ids: string[]): Observable<VTubersListResponse> {
    return this.http.get<VTubersListResponse>(`${BASE_URL}/vtubers`, {
      params: new HttpParams().set("ids", ids.join(","))
    });
  }

  getVTuberStat(id: string): Observable<VTuberDetailResponse> {
    return this.http.get<VTuberDetailResponse>(`${BASE_URL}/vtubers/${id}`);
  }

  getStreams(ids: string[]): Observable<StreamsListResponse> {
    return this.http.get<StreamsListResponse>(`${BASE_URL}/streams`, {
      params: new HttpParams().set("ids", ids.join(","))
    });
  }

  getStreamsWithSkip(
    ids: string[],
    skip: string
  ): Observable<StreamsListResponse> {
    return this.http.get<StreamsListResponse>(`${BASE_URL}/streams`, {
      params: new HttpParams().set("ids", ids.join(",")).set("skip", skip)
    });
  }

  getStreamStat(id: string): Observable<StreamDetailResponse> {
    return this.http.get<StreamDetailResponse>(`${BASE_URL}/streams/${id}`);
  }
}
