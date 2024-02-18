import { inject } from "@angular/core";
import {
  CanActivateFn,
  ResolveFn,
  createUrlTreeFromSnapshot,
} from "@angular/router";
import { Platform, Stream } from "src/app/models";

import * as api from "src/app/shared/api/entrypoint";
import { QUERY_CLIENT } from "src/app/shared/tokens";

export const streamCanActive: CanActivateFn = async (route) => {
  const queryClient = inject(QUERY_CLIENT);

  const id = route.paramMap.get("id");
  const platform = route.data.platform;

  if (!id) {
    return createUrlTreeFromSnapshot(route, ["/404"]);
  }

  if (!platform) {
    const streamId = Number(id);

    if (!streamId || Number.isNaN(streamId)) {
      return createUrlTreeFromSnapshot(route, ["/404"]);
    }

    const stream = await api.streamsById(streamId);

    if (!stream) {
      return createUrlTreeFromSnapshot(route, ["/404"]);
    }

    queryClient.setQueryData(
      ["stream", { platform: stream.platform, platformId: stream.platformId }],
      stream,
    );

    return createUrlTreeFromSnapshot(route, [
      `${stream.platform.toLowerCase()}-stream`,
      stream.platformId,
    ]);
  }

  const stream = await queryClient.fetchQuery<
    Stream,
    unknown,
    Stream,
    ["stream", { platform: Platform; platformId: string }]
  >({
    queryKey: ["stream", { platform, platformId: id }],
    queryFn: ({ queryKey: [_, { platform, platformId }] }) =>
      api.streamsByPlatformId(platform, platformId),
    staleTime: 5 * 60 * 1000, // 5min
  });

  if (!stream) {
    return createUrlTreeFromSnapshot(route, ["/404"]);
  }

  return true;
};

export const streamResolve: ResolveFn<Stream | null> = async (route) => {
  const queryClient = inject(QUERY_CLIENT);

  const id = route.paramMap.get("id")!;
  const platform: Platform = route.data.platform;

  return queryClient.fetchQuery<
    Stream,
    unknown,
    Stream,
    ["stream", { platform: Platform; platformId: string }]
  >({
    queryKey: ["stream", { platform, platformId: id }],
    queryFn: ({ queryKey: [_, { platform, platformId }] }) =>
      api.streamsByPlatformId(platform, platformId),
    staleTime: 5 * 60 * 1000, // 5min
  });
};
