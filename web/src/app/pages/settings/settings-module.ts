import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatTreeModule } from "@angular/material/tree";

import { SharedModule } from "src/app/shared/shared.module";
import { ComponentsModule } from "src/app/components/components.module";

import { Settings } from "./settings";
import { PlaylistSelector } from "./playlist-selector/playlist-selector";
import { YouTubeSettings } from "./youtube-settings/youtube-settings";
import { VTubersSettings } from "./vtubers-settings/vtubers-settings";

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [PlaylistSelector, Settings, VTubersSettings, YouTubeSettings],
})
export class SettingsModule {}
