import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Title } from "@angular/platform-browser";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";

import { vtubers, batches } from "vtubers";

import { ConfigService } from "src/app/shared";

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
  selector: "hs-settings",
  templateUrl: "settings.html",
  styleUrls: ["settings.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Settings implements OnInit {
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

  constructor(public config: ConfigService, private title: Title) {
    this.dataSource.data = Object.entries(batches).map(([id, batch]) => ({
      id,
      members: batch.vtubers.map((id) => vtubers[id]),
    }));
  }

  ngOnInit() {
    this.title.setTitle(`${$localize`:@@settings:`} | HoloStats`);
  }

  hasChild = (_: number, node: VTuberFlatNode) => node.expandable;

  isSelected = (id: string): boolean => this.config.selectedVTubers.has(id);

  getMemberIds = (id: string): string[] => batches[id].vtubers;

  toggleVTuber(id: string) {
    if (this.isSelected(id)) {
      this.config.unselectVTubers([id]);
    } else {
      this.config.selectVTubers([id]);
    }
  }

  toggleBatch(id: string) {
    const ids = this.getMemberIds(id);

    if (ids.every((id) => this.isSelected(id))) {
      this.config.unselectVTubers(ids);
    } else {
      this.config.selectVTubers(ids);
    }
  }

  batchAllSelected(id: string): boolean {
    return this.getMemberIds(id).every((id) => this.isSelected(id));
  }

  batchPartiallySelected(id: string): boolean {
    const ids = this.getMemberIds(id);

    return (
      ids.some((id) => this.isSelected(id)) &&
      !ids.every((id) => this.isSelected(id))
    );
  }
}
