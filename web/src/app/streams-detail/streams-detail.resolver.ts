import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { StreamResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class StreamsDetailResolver implements Resolve<StreamResponse> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<StreamResponse> {
    return this.apiService.getStream(route.paramMap.get("id"));
  }
}
