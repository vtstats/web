import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { StreamReportOption, StreamReportResponse } from "src/app/models";

const BASE_URL = "https://holoapi.poi.cat/api/v4";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

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
