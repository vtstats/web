import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { MatTreeModule } from "@angular/material/tree";
import { EllipsisModule } from "ngx-ellipsis";

import { SharedModule } from "../shared";
import { ComponentsModule } from "../components/components.module";

import { BilibiliChannel } from "./bilibili-channel/bilibili-channel";
import { Settings } from "./settings/settings";
import { YoutubeChannel } from "./youtube-channel/youtube-channel";
import { YoutubeChannelEX } from "./youtube-channel-ex/youtube-channel-ex";
import { YoutubeScheduleStream } from "./youtube-schedule-stream/youtube-schedule-stream";
import { YoutubeStream } from "./youtube-stream/youtube-stream";
import { VTubersDetail } from "./vtubers-detail/vtubers-detail";
import { StreamsDetail } from "./streams-detail/streams-detail";
import { NotFound } from "./not-found/not-found";

@NgModule({
  declarations: [
    BilibiliChannel,
    Settings,
    YoutubeChannel,
    YoutubeChannelEX,
    YoutubeScheduleStream,
    YoutubeStream,
    VTubersDetail,
    StreamsDetail,
    NotFound,
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
    MatNativeDateModule,
    MatDatepickerModule,
    MatDividerModule,
    ComponentsModule,
    SharedModule,
  ],
})
export class PagesModule {}
