import { Injectable, computed, inject } from "@angular/core";

import { localStorageSignal } from "src/utils";
import {
  CATALOG_CHANNELS,
  CATALOG_GROUPS,
  CATALOG_VTUBERS,
  QUERY_CLIENT,
} from "../tokens";

@Injectable({ providedIn: "root" })
export class VTuberService {
  queryClient = inject(QUERY_CLIENT);

  nameSetting = localStorageSignal<
    "nativeName" | "englishName" | "japaneseName"
  >("vts:nameSetting", "nativeName");
  selected = localStorageSignal<string[]>("vts:vtuberSelected", []);

  selectedIds = computed(() => {
    const selected = this.selected();
    return this.vtubers
      .map((v) => v.vtuberId)
      .filter((id) => selected.includes(id));
  });

  vtubers = inject(CATALOG_VTUBERS);
  channels = inject(CATALOG_CHANNELS);
  groups = inject(CATALOG_GROUPS);

  vtuberNames = computed(() => {
    const nameSetting = this.nameSetting();

    return this.vtubers.reduce(
      (acc, i) => {
        acc[i.vtuberId] = i[nameSetting] || i.nativeName;
        return acc;
      },
      {} as Record<string, string>,
    );
  });

  selectedChannels = computed(() => {
    const selected = this.selected();
    return this.channels.filter((c) => selected.includes(c.vtuberId));
  });

  groupNames = computed(() => {
    const nameSetting = this.nameSetting();

    return this.groups.reduce(
      (acc, i) => {
        acc[i.groupId] = i[nameSetting] || i.nativeName;
        return acc;
      },
      {} as Record<string, string>,
    );
  });
}
