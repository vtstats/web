import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

import {
  StreamDetailResponse,
  StreamsListResponse,
  VTubersListResponse,
  VTuberDetailResponse
} from "@holostats/libs/models";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}

  getVTubers(ids: string[]): Observable<VTubersListResponse> {
    this.spinner.show();
    return this.http
      .get<VTubersListResponse>("https://holo.poi.cat/api/vtubers", {
        params: new HttpParams().set("ids", ids.join(","))
      })
      .pipe(finalize(() => this.spinner.hide()));
  }

  getVTuberStat(id: string): Observable<VTuberDetailResponse> {
    this.spinner.show();
    return this.http
      .get<VTuberDetailResponse>("https://holo.poi.cat/api/vtubers/" + id)
      .pipe(finalize(() => this.spinner.hide()));
  }

  getStreams(ids: string[]) {
    this.spinner.show();
    return this.http
      .get<StreamsListResponse>("https://holo.poi.cat/api/streams", {
        params: new HttpParams().set("ids", ids.join(","))
      })
      .pipe(finalize(() => this.spinner.hide()));
  }

  getStreamStat(id: string) {
    this.spinner.show();
    return this.http
      .get<StreamDetailResponse>("https://holo.poi.cat/api/streams/" + id)
      .pipe(finalize(() => this.spinner.hide()));
  }
}
