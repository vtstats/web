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
import { MatListModule } from "@angular/material/list";

import { SharedModule } from "../shared";
import { ComponentsModule } from "../components/components.module";

import { BilibiliChannel } from "./bilibili-channel/bilibili-channel";
import { YoutubeChannel } from "./youtube-channel/youtube-channel";
import { YoutubeScheduleStream } from "./youtube-schedule-stream/youtube-schedule-stream";
import { YoutubeStream } from "./youtube-stream/youtube-stream";
import { VTubersDetailModule } from "./vtubers-detail/vtubers-detail-module";
import { StreamsDetailModule } from "./streams-detail/streams-detail-module";
import { NotFound } from "./not-found/not-found";
import { SettingsModule } from "./settings/settings-module";

@NgModule({
  declarations: [
    BilibiliChannel,
    YoutubeChannel,
    YoutubeScheduleStream,
    YoutubeStream,
    NotFound,
  ],
  imports: [
    SettingsModule,
    StreamsDetailModule,
    VTubersDetailModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTreeModule,
    MatListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDividerModule,
    ComponentsModule,
    SharedModule,
  ],
})
export class PagesModule {}
