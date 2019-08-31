import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import {
  StreamDetailResponse,
  StreamsListResponse,
  VTubersListResponse,
  VTuberDetailResponse
} from "@holostats/libs/models";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  private isLoadingSource = new BehaviorSubject<boolean>(false);

  isLoading$ = this.isLoadingSource.asObservable();

  getVTubers(ids: string[]): Observable<VTubersListResponse> {
    this.isLoadingSource.next(true);
    return this.http
      .get<VTubersListResponse>("https://holo.poi.cat/api/vtubers", {
        params: new HttpParams().set("ids", ids.join(","))
      })
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }

  getVTuberStat(id: string): Observable<VTuberDetailResponse> {
    this.isLoadingSource.next(true);
    return this.http
      .get<VTuberDetailResponse>("https://holo.poi.cat/api/vtubers/" + id)
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }

  getStreams(ids: string[]) {
    this.isLoadingSource.next(true);
    return this.http
      .get<StreamsListResponse>("https://holo.poi.cat/api/streams", {
        params: new HttpParams().set("ids", ids.join(","))
      })
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }

  getStreamStat(id: string) {
    this.isLoadingSource.next(true);
    return this.http
      .get<StreamDetailResponse>("https://holo.poi.cat/api/streams/" + id)
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }
}
