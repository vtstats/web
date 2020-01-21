import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { Observable } from "rxjs";

import { VTuberResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class VtubersDetailResolver implements Resolve<VTuberResponse> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<VTuberResponse> {
    const today = new Date();
    return this.apiService.getVTuber(
      route.paramMap.get("id"),
      startOfDay(subDays(today, 7)),
      endOfDay(today)
    );
  }
}
