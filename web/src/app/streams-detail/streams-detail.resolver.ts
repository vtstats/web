import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { StreamDetail } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class StreamsDetailResolver implements Resolve<StreamDetail> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<StreamDetail> {
    return this.apiService.getStreamStat(route.paramMap.get("id"));
  }
}
