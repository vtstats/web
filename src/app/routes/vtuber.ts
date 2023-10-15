import { inject } from "@angular/core";
import {
  CanActivateFn,
  ResolveFn,
  createUrlTreeFromSnapshot,
} from "@angular/router";

import { Channel, VTuber } from "src/app/models";
import { VTuberService } from "src/app/shared/config/vtuber.service";
import { CATALOG_VTUBERS } from "../shared/tokens";

export const vtuberCanActive: CanActivateFn = (route) => {
  const id = route.paramMap.get("vtuberId");
  const vtubers = inject(CATALOG_VTUBERS);

  const vtuber = vtubers.find((v) => v.vtuberId === id);

  if (!vtuber) {
    return createUrlTreeFromSnapshot(route, ["/404"]);
  }

  return true;
};

export const vtuberResolve: ResolveFn<{
  name: string;
  vtuber: VTuber;
  channels: Channel[];
}> = async (route) => {
  const id = route.paramMap.get("vtuberId");
  const vtuberSrv = inject(VTuberService);

  const vtuber = vtuberSrv.vtubers.find((v) => v.vtuberId === id)!;

  const channels = vtuberSrv.channels
    .filter((c) => c.vtuberId === id)
    .sort((a, b) => b.platform.localeCompare(a.platform));

  const name = vtuberSrv.vtuberNames()[vtuber.vtuberId];

  return { name, vtuber, channels };
};
