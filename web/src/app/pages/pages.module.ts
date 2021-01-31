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

import { BilibiliChannelComponent } from "./bilibili-channel";
import { SettingsComponent } from "./settings";
import { YoutubeChannelComponent } from "./youtube-channel";
import { YoutubeScheduleStreamComponent } from "./youtube-schedule-stream";
import { YoutubeStreamComponent } from "./youtube-stream";
import { VTubersDetailComponent } from "./vtubers-detail";
import { StreamsDetailComponent } from "./streams-detail";
import { NotFoundComponent } from "./not-found";

@NgModule({
  declarations: [
    BilibiliChannelComponent,
    SettingsComponent,
    YoutubeChannelComponent,
    YoutubeScheduleStreamComponent,
    YoutubeStreamComponent,
    VTubersDetailComponent,
    StreamsDetailComponent,
    NotFoundComponent,
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
    SharedModule,
  ],
})
export class PagesModule {}
