import { Component, ViewEncapsulation } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";

import { vtubers, batches } from "vtubers";

import { Config } from "src/app/services";

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

  count = Object.keys(vtubers).length;

  constructor(public config: Config) {
    this.dataSource.data = Object.entries(batches).map(([id, batch]) => ({
      id,
      name: batch.name,
      members: batch.vtubers.map(id => vtubers[id])
    }));
  }

  getMemberIds(id: string): string[] {
    return batches[id].vtubers;
  }

  toggleVTuber(id: string) {
    if (this.config.selectedVTubers.has(id)) {
      this.config.unselectVTubers([id]);
    } else {
      this.config.selectVTubers([id]);
    }
  }

  toggleBatch(id: string) {
    const vtuberIds = this.getMemberIds(id);
    if (vtuberIds.every(id => this.config.selectedVTubers.has(id))) {
      this.config.unselectVTubers(vtuberIds);
    } else {
      this.config.selectVTubers(vtuberIds);
    }
  }

  vtuberSelected(id: string): boolean {
    return this.config.selectedVTubers.has(id);
  }

  batchAllSelected(id: string): boolean {
    return this.getMemberIds(id).every(id =>
      this.config.selectedVTubers.has(id)
    );
  }

  batchPartiallySelected(id: string): boolean {
    const memberIds = this.getMemberIds(id);
    return (
      memberIds.some(id => this.config.selectedVTubers.has(id)) &&
      !memberIds.every(id => this.config.selectedVTubers.has(id))
    );
  }
}
