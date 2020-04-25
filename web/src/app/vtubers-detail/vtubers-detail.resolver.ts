import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import dayjs from "dayjs";
import { Observable } from "rxjs";

import { ChannelReportResponse } from "../models";
import { ApiService } from "../services";

@Injectable({ providedIn: "root" })
export class VtubersDetailResolver implements Resolve<ChannelReportResponse> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ChannelReportResponse> {
    const end = dayjs().endOf("day");
    return this.apiService.getChannelReport(
      route.paramMap.get("id"),
      "youtube_channel_subscriber,youtube_channel_view,bilibili_channel_subscriber,bilibili_channel_view",
      end.subtract(7, "day"),
      end
    );
  }
}
