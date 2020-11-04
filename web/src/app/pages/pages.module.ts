import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTreeModule } from "@angular/material/tree";
import { EllipsisModule } from "ngx-ellipsis";

import { SharedModule } from "../shared";
import { ComponentsModule } from "../components/components.module";

import { BilibiliChannel } from "./bilibili-channel/bilibili-channel";
import { Settings } from "./settings/settings";
import { YoutubeChannel } from "./youtube-channel/youtube-channel";
import { YoutubeScheduleStream } from "./youtube-schedule-stream/youtube-schedule-stream";
import { YoutubeStream } from "./youtube-stream/youtube-stream";
import { VTubersDetail } from "./vtubers-detail/vtubers-detail";
import { StreamsDetail } from "./streams-detail/streams-detail";
import { NotFound } from "./not-found/not-found";
import { AppShell } from "./app-shell/app-shell";

@NgModule({
  declarations: [
    BilibiliChannel,
    Settings,
    YoutubeChannel,
    YoutubeScheduleStream,
    YoutubeStream,
    VTubersDetail,
    StreamsDetail,
    NotFound,
    AppShell,
  ],
  imports: [
    CommonModule,
    RouterModule,
    EllipsisModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTreeModule,
    ComponentsModule,
    SharedModule,
  ],
})
export class PagesModule {}
