import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import {
  StreamDetail,
  StreamsList,
  VTubersList,
  VTuberDetail
} from "../models";
import { Config } from "./config";

const BASE_URL = "https://holo.poi.cat/api";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient, private config: Config) {}

  getVTubers(): Observable<VTubersList> {
    return this.http.get<VTubersList>(`${BASE_URL}/vtubers`, {
      params: new HttpParams().set("ids", this.config.joinedSelectedVTubers)
    });
  }

  getVTuberStat(id: string): Observable<VTuberDetail> {
    return this.http.get<VTuberDetail>(`${BASE_URL}/vtubers/${id}`);
  }

  getStreams(): Observable<StreamsList> {
    return this.http.get<StreamsList>(`${BASE_URL}/streams`, {
      params: new HttpParams().set("ids", this.config.joinedSelectedVTubers)
    });
  }

  getStreamsWithSkip(skip: string): Observable<StreamsList> {
    return this.http.get<StreamsList>(`${BASE_URL}/streams`, {
      params: new HttpParams()
        .set("ids", this.config.joinedSelectedVTubers)
        .set("skip", skip)
    });
  }

  getStreamStat(id: string): Observable<StreamDetail> {
    return this.http.get<StreamDetail>(`${BASE_URL}/streams/${id}`);
  }
}
