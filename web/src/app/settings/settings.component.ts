import { Component } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { Location } from "@angular/common";

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

  constructor(public config: Config, private location: Location) {
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
    { index: 2, value: "youtubeSubs", name: "YouTube 訂閱" },
    { index: 3, value: "youtubeDailySubs", name: "(YouTube 訂閱) 日增" },
    { index: 4, value: "youtubeViews", name: "YouTube 觀看" },
    { index: 5, value: "youtubeDailyViews", name: "(YouTube 觀看) 日增" },
    { index: 6, value: "bilibiliSubs", name: "Bilibili 訂閱" },
    { index: 7, value: "bilibiliDailySubs", name: "(Bilibili 訂閱) 日增" },
    { index: 8, value: "bilibiliViews", name: "Bilibili 觀看" },
    { index: 9, value: "bilibiliDailyViews", name: "(Bilibili 觀看) 日增" }
  ];

  columnSelected(index: number): boolean {
    return this.config.selectedColumns[index] !== "";
  }

  toggleColumn(column: string, index: number) {
    let selectedColumns = this.config.selectedColumns;
    selectedColumns[index] = this.columnSelected(index) ? "" : column;
    this.config.selectedColumns = selectedColumns;
  }

  ///// Misc
  backClicked() {
    this.location.back();
  }
}
