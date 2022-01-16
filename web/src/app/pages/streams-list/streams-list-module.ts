import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { SharedModule } from "src/app/shared";
import { ComponentsModule } from "src/app/components/components.module";

import { YoutubeStream } from "./youtube-stream/youtube-stream";
import { YoutubeScheduleStream } from "./youtube-schedule-stream/youtube-schedule-stream";

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    RouterModule.forChild([
      {
        matcher: (url, group) =>
          group.segments[0]?.path === "youtube-stream"
            ? { consumed: url }
            : null,
        component: YoutubeStream,
      },
      {
        matcher: (url, group) =>
          group.segments[0]?.path === "youtube-schedule-stream"
            ? { consumed: url }
            : null,
        component: YoutubeScheduleStream,
      },
    ]),
  ],
  exports: [],
  declarations: [YoutubeStream, YoutubeScheduleStream],
  providers: [],
})
export class StreamsListModule {}
