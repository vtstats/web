import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { StreamReportResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class StreamsDetailResolver implements Resolve<StreamReportResponse> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<StreamReportResponse> {
    return this.apiService.getStreamReport(route.paramMap.get("id"));
  }
}
