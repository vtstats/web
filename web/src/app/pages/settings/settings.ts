import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Title } from "@angular/platform-browser";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";

import { translate } from "src/i18n/translations";

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
    this.title.setTitle(`${translate("settings")} | HoloStats`);
  }

  hasChild = (_: number, node: VTuberFlatNode) => node.expandable;

  isSelected = (id: string): boolean => this.config.vtuber.has(id);

  getMemberIds = (id: string): string[] => batches[id].vtubers;

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
