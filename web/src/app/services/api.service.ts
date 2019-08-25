import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { VTuberDocument, Stat } from "@holostats/libs/models";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { VTuberStats } from "@holostats/libs/models";

export type VTubersResponse = { vtubers: VTuberDocument[]; updatedAt: Date };
export type VTuberStatsReponse = VTuberStats;

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  private isLoadingSource = new BehaviorSubject<boolean>(false);

  isLoading$ = this.isLoadingSource.asObservable();

  getVTubers(ids: string[]): Observable<VTubersResponse> {
    this.isLoadingSource.next(true);
    return this.http
      .get<VTubersResponse>("https://holo.poi.cat/api/vtubers", {
        params: new HttpParams().set("ids", ids.join(","))
      })
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }

  getVTuberStat(id: string): Observable<VTuberStatsReponse> {
    this.isLoadingSource.next(true);
    return this.http
      .get<VTuberStatsReponse>("https://holo.poi.cat/api/vtubers/" + id)
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }

  getStreams(ids: string[]) {
    this.isLoadingSource.next(true);
    return this.http
      .get<VTubersResponse>("https://holo.poi.cat/api/streams", {
        params: new HttpParams().set("ids", ids.join(","))
      })
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }

  getStreamStat(id: string) {
    this.isLoadingSource.next(true);
    return this.http
      .get("https://holo.poi.cat/api/streams/" + id)
      .pipe(finalize(() => this.isLoadingSource.next(false)));
  }
}
