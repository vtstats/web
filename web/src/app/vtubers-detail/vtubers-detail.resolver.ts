import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { ApiService } from "../services";
import { VTuberDetail } from "../models";

@Injectable({ providedIn: "root" })
export class VtubersDetailResolver implements Resolve<VTuberDetail> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<VTuberDetail> {
    return this.apiService.getVTuberStat(route.paramMap.get("id"));
  }
}
