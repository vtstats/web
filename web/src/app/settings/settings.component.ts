import { Component, ViewEncapsulation } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";

import * as vtubers from "vtubers";

import { Config } from "../services";

interface VTuberNode {
  id: string;
  name: string;
  members?: VTuberNode[];
}

interface VTuberFlatNode {
  id: string;
  name: string;
  expandable: boolean;
  level: number;
}

@Component({
  selector: "hs-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent {
  treeControl = new FlatTreeControl<VTuberFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    (node: VTuberNode, level) => ({
      level: level,
      id: node.id,
      name: node.name,
      expandable: !!node.members && node.members.length > 0
    }),
    node => node.level,
    node => node.expandable,
    node => node.members
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: VTuberFlatNode) => node.expandable;

  count = vtubers.items.reduce((acc, val) => acc + val.members.length, 0);

  constructor(public config: Config) {
    this.dataSource.data = vtubers.items;
  }

  getMemberIds(id: string): string[] {
    let ids = [];
    for (const member of vtubers.items.find(i => i.id == id).members) {
      ids.push(member.id);
    }
    return ids;
  }

  toggleVTuber(id: string) {
    if (this.config.selectedVTubers.has(id)) {
      this.config.unselectVTubers([id]);
    } else {
      this.config.selectVTubers([id]);
    }
  }

  toggleVTuberGroup(id: string) {
    const memberIds = this.getMemberIds(id);
    if (memberIds.every(id => this.config.selectedVTubers.has(id))) {
      this.config.unselectVTubers(memberIds);
    } else {
      this.config.selectVTubers(memberIds);
    }
  }

  vtuberSelected(id: string): boolean {
    return this.config.selectedVTubers.has(id);
  }

  vtuberGroupAllSelected(id: string): boolean {
    return this.getMemberIds(id).every(id =>
      this.config.selectedVTubers.has(id)
    );
  }

  vtuberGroupPartiallySelected(id: string): boolean {
    const memberIds = this.getMemberIds(id);
    return (
      memberIds.some(id => this.config.selectedVTubers.has(id)) &&
      !memberIds.every(id => this.config.selectedVTubers.has(id))
    );
  }
}
