import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from "@angular/material/tree";

import { batches, vtubers } from "vtubers";

import { ConfigService, NamePipe } from "src/app/shared";

interface VTuberNode {
  id: string;
  members?: VTuberNode[];
}

interface VTuberFlatNode {
  id: string;
  expandable: boolean;
  level: number;
}

@Component({
  standalone: true,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    NamePipe,
  ],
  selector: "hls-vtubers-settings",
  templateUrl: "vtubers-settings.html",
})
export class VTubersSettings {
  treeControl = new FlatTreeControl<VTuberFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    (node: VTuberNode, level) => ({
      level: level,
      id: node.id,
      expandable: !!node.members && node.members.length > 0,
    }),
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.members
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  count = Object.keys(vtubers).length;

  constructor(public config: ConfigService) {
    this.dataSource.data = Object.entries(batches).map(([id, batch]) => ({
      id,
      members: batch?.map((id) => vtubers[id]),
    }));
  }

  hasChild = (_: number, node: VTuberFlatNode) => node.expandable;

  isSelected = (id: string): boolean => this.config.vtuber.has(id);

  getMemberIds = (id: string): string[] => batches[id];

  toggleVTuber(id: string) {
    if (this.isSelected(id)) {
      this.config.deleteVTubers([id]);
    } else {
      this.config.addVtubers([id]);
    }
  }

  toggleBatch(id: string) {
    const ids = this.getMemberIds(id);

    if (ids.every(this.isSelected)) {
      this.config.deleteVTubers(ids);
    } else {
      this.config.addVtubers(ids);
    }
  }

  batchAllSelected(id: string): boolean {
    return this.getMemberIds(id).every(this.isSelected);
  }

  batchPartiallySelected(id: string): boolean {
    const ids = this.getMemberIds(id);

    return ids.some(this.isSelected) && !ids.every(this.isSelected);
  }
}
