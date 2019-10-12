import { Component } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";

import { VTUBERS, VTUBERS_BY_GROUP } from "@holostats/libs/const";
import { VTuberInfo, VTuberGroup } from "@holostats/libs/models";

import { Config } from "../services";

type VTuberNode = VTuberInfo | VTuberGroup;
type VTuberFlatNode = VTuberNode & { level: number };

@Component({
  selector: "hs-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent {
  toggleDarkTheme() {
    this.config.enableDarkMode = !this.config.enableDarkMode;
  }

  treeControl = new FlatTreeControl<VTuberFlatNode>(
    node => node.level,
    node => ("members" in node ? true : false)
  );

  treeFlattener = new MatTreeFlattener(
    (node: VTuberNode, level) => ({ ...node, level }),
    node => node.level,
    node => ("members" in node ? true : false),
    node => ("members" in node ? node.members : null)
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: VTuberFlatNode) =>
    "members" in node ? true : false;

  count = VTUBERS.length;

  constructor(public config: Config) {
    this.dataSource.data = VTUBERS_BY_GROUP;
  }

  getMemberIds(groupId: string): string[] {
    return (VTUBERS_BY_GROUP.find(
      g => g.id == groupId
    ) as VTuberGroup).members.map(m => m.id);
  }

  toggleVTuber(id: string) {
    const index = this.config.selectedVTubers.indexOf(id);
    let selectedVTubers = this.config.selectedVTubers;
    if (index > -1) {
      selectedVTubers.splice(index, 1);
    } else {
      selectedVTubers.push(id);
    }
    this.config.selectedVTubers = selectedVTubers;
  }

  toggleVTuberGroup(id: string) {
    const memberIds = this.getMemberIds(id);
    let selectedVTubers = this.config.selectedVTubers;
    if (memberIds.every(id => selectedVTubers.includes(id))) {
      selectedVTubers = selectedVTubers.filter(id => !memberIds.includes(id));
    } else {
      memberIds.forEach(id => selectedVTubers.push(id));
    }
    this.config.selectedVTubers = selectedVTubers;
  }

  vtuberSelected(id: string): boolean {
    return this.config.selectedVTubers.includes(id);
  }

  vtuberGroupAllSelected(id: string): boolean {
    return this.getMemberIds(id).every(id =>
      this.config.selectedVTubers.includes(id)
    );
  }

  vtuberGroupPartiallySelected(id: string): boolean {
    const memberIds = this.getMemberIds(id);
    return (
      memberIds.some(id => this.config.selectedVTubers.includes(id)) &&
      !memberIds.every(id => this.config.selectedVTubers.includes(id))
    );
  }

  ///// Display Columns
  readonly columns = [
    { value: "youtubeSubs", name: "YouTube 訂閱" },
    { value: "youtubeDailySubs", name: "(YouTube 訂閱) 日增" },
    { value: "youtubeWeeklySubs", name: "(YouTube 訂閱) 周增" },
    { value: "youtubeViews", name: "YouTube 觀看" },
    { value: "youtubeDailyViews", name: "(YouTube 觀看) 日增" },
    { value: "youtubeWeeklyViews", name: "(YouTube 觀看) 周增" },
    { value: "bilibiliSubs", name: "Bilibili 訂閱" },
    { value: "bilibiliDailySubs", name: "(Bilibili 訂閱) 日增" },
    { value: "bilibiliWeeklySubs", name: "(Bilibili 訂閱) 周增" },
    { value: "bilibiliViews", name: "Bilibili 觀看" },
    { value: "bilibiliDailyViews", name: "(Bilibili 觀看) 日增" },
    { value: "bilibiliWeeklyViews", name: "(Bilibili 觀看) 周增" }
  ];

  columnSelected(column: string): boolean {
    return this.config.selectedColumns.includes(column);
  }

  toggleColumn(column: string) {
    if (this.columnSelected(column)) {
      this.config.removeColumns(column);
    } else {
      this.config.addColumns(column);
    }
  }
}
