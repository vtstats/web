export const enum Platform {
  YOUTUBE = "YOUTUBE",
  TWITCH = "TWITCH",
  BILIBILI = "BILIBILI",
}

export type Channel = {
  channelId: number;
  platformId: string;
  vtuberId: string;
  platform: Platform;
};

export type ChannelStatsSummary = Channel & {
  view: number;
  view1dAgo: number;
  view7dAgo: number;
  view30dAgo: number;

  subscriber: number;
  subscriber1dAgo: number;
  subscriber7dAgo: number;
  subscriber30dAgo: number;

  revenue: Record<string, number>;
  revenue1dAgo: Record<string, number>;
  revenue7dAgo: Record<string, number>;
  revenue30dAgo: Record<string, number>;
};

export type Stream = {
  platform: Platform;
  streamId: number;
  platformId: string;
  title: string;
  highlightedTitle?: string;
  vtuberId: string;
  thumbnailUrl: string;

  status: StreamStatus;

  scheduleTime?: number;
  startTime?: number;
  endTime?: number;
  updatedAt: number;

  viewerAvg?: number;
  viewerMax?: number;
  likeMax?: number;
};

export const enum StreamStatus {
  SCHEDULED = "SCHEDULED",
  LIVE = "LIVE",
  ENDED = "ENDED",
}

export type VTuber = {
  vtuberId: string;
  nativeName: string;
  englishName: string;
  japaneseName: string;
  thumbnailUrl: string;
  twitterUsername: string;
};

export type Group = {
  groupId: string;
  root: boolean;
  nativeName: string;
  englishName: string;
  japaneseName: string;
  children: Array<`vtuber:${string}` | `group:${string}`>;
};

export type Catalog = {
  vtubers: Array<VTuber>;
  groups: Array<Group>;
  channels: Array<Channel>;
};

export const enum StreamEventKind {
  YOUTUBE_SUPER_CHAT = "YOUTUBE_SUPER_CHAT",
  YOUTUBE_SUPER_STICKER = "YOUTUBE_SUPER_STICKER",
  YOUTUBE_NEW_MEMBER = "YOUTUBE_NEW_MEMBER",
  YOUTUBE_MEMBER_MILESTONE = "YOUTUBE_MEMBER_MILESTONE",
  TWITCH_CHEERING = "TWITCH_CHEERING",
  TWITCH_HYPER_CHAT = "TWITCH_HYPER_CHAT",
}

export type StreamsEvent =
  | {
      time: number;
      kind: StreamEventKind.YOUTUBE_SUPER_CHAT;
      value: StreamPaidEvent;
    }
  | {
      time: number;
      kind: StreamEventKind.YOUTUBE_SUPER_STICKER;
      value: StreamPaidEvent;
    }
  | {
      time: number;
      kind: StreamEventKind.YOUTUBE_NEW_MEMBER;
    }
  | {
      time: number;
      kind: StreamEventKind.YOUTUBE_MEMBER_MILESTONE;
    }
  | {
      time: number;
      kind: StreamEventKind.TWITCH_CHEERING;
      value: { bits: number };
    }
  | {
      time: number;
      kind: StreamEventKind.TWITCH_HYPER_CHAT;
      value: { amount: string; currency_code: string };
    };

export type StreamPaidEvent = {
  amount: string;
  currencyCode: string;
  color: YouTubeChatColor;
};

export const enum YouTubeChatColor {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  BLUE = "BLUE",
  LIGHT_BLUE = "LIGHT_BLUE",
  ORANGE = "ORANGE",
  MAGENTA = "MAGENTA",
  RED = "RED",
}

export type YouTubePlayListItem = {
  id: string;
  snippet: { localized: { title: string } };
  contentDetails: { itemCount: number };
};

export type YouTubePlaylistResponse = {
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Array<YouTubePlayListItem>;
};

export type YouTubeAddPlaylistItemResponse = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
};
