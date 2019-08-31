import { VERSION, Component } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { Location } from "@angular/common";

import { VTUBERS, VTUBERS_BY_GROUP } from "@holostats/libs/const";
import { VTuberInfo, VTuberGroup } from "@holostats/libs/models";

import { ConfigService } from "../services";

type VTuberNode = VTuberInfo | VTuberGroup;
type VTuberFlatNode = VTuberNode & { level: number };

@Component({
  selector: "hs-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent {
  readonly ANGULAR_VERSION = VERSION.full;

  toggleDarkTheme() {
    this.configService.toggleDarkMode();
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

  // change to use Set
  ids = this.configService.getSubscribeIds();

  count = VTUBERS.length;

  enableDarkMode = true;

  constructor(
    private configService: ConfigService,
    private location: Location
  ) {
    this.dataSource.data = VTUBERS_BY_GROUP;
    this.configService.enableDarkMode$.subscribe(
      val => (this.enableDarkMode = val)
    );
  }

  getMemberIds(groupId: string) {
    const group = VTUBERS_BY_GROUP.find(g => g.id == groupId) as VTuberGroup;
    return group.members.map(m => m.id);
  }

  toggleItem(id: string) {
    const index = this.ids.indexOf(id);
    if (index > -1) {
      this.ids.splice(index, 1);
    } else {
      this.ids.push(id);
    }
    this.configService.setSubscribeIds(this.ids);
  }

  toggleGroup(id: string) {
    const memberIds = this.getMemberIds(id);
    if (memberIds.every(id => this.ids.includes(id))) {
      this.ids = this.ids.filter(id => !memberIds.includes(id));
    } else {
      memberIds.forEach(id => this.ids.push(id));
    }
    this.configService.setSubscribeIds(this.ids);
  }

  itemSelected(id: string): boolean {
    return this.ids.includes(id);
  }

  groupAllSelected(id: string): boolean {
    return this.getMemberIds(id).every(id => this.ids.includes(id));
  }

  groupPartiallySelected(id: string): boolean {
    const memberIds = this.getMemberIds(id);
    return (
      memberIds.some(id => this.ids.includes(id)) &&
      !memberIds.every(id => this.ids.includes(id))
    );
  }

  applyChange() {
    this.configService.setSubscribeIds(this.ids);
  }

  backClicked() {
    this.location.back();
  }
}
