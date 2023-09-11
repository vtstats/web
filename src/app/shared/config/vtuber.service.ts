import { Injectable, computed, signal } from "@angular/core";
import { localStorageSignal } from "src/utils";

import { Channel, Group, Platform, VTuber } from "src/app/models";
import * as api from "src/app/shared/api/entrypoint";

@Injectable({ providedIn: "root" })
export class VTuberService {
  nameSetting = localStorageSignal("vts:nameSetting", "nativeName");
  selected = localStorageSignal<string[]>("vts:vtuberSelected", []);

  selectedIds = computed(() => {
    const selected = this.selected();
    return this.vtubers()
      .map((v) => v.vtuberId)
      .filter((id) => selected.includes(id));
  });

  vtubers = signal<VTuber[]>([]);
  channels = signal<Channel[]>([]);
  groups = signal<Group[]>([]);

  vtuberNames = computed(() => {
    const nameSetting = this.nameSetting();

    return this.vtubers().reduce((acc, i) => {
      acc[i.vtuberId] = i[nameSetting] || i.nativeName;
      return acc;
    }, {} as Record<string, string>);
  });

  selectedChannels = computed(() => {
    const selected = this.selected();
    return this.channels().filter((c) => selected.includes(c.vtuberId));
  });

  groupNames = computed(() => {
    const nameSetting = this.nameSetting();

    return this.groups().reduce((acc, i) => {
      acc[i.groupId] = i[nameSetting] || i.nativeName;
      return acc;
    }, {} as Record<string, string>);
  });

  async initialize() {
    const { vtubers, channels, groups } = await api.catalog();

    this.vtubers.set(vtubers);
    this.groups.set(groups);
    this.channels.set(channels);
  }
}
