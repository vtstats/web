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

export const enum ChannelStatsKind {
  VIEW = "VIEW",
  REVENUE = "REVENUE",
  SUBSCRIBER = "SUBSCRIBER",
}

export type ChannelStatsSummary =
  | {
      channelId: number;
      updatedAt: number;
      kind: ChannelStatsKind.REVENUE;
      value: Record<string, number>;
      value1DayAgo: Record<string, number>;
      value7DaysAgo: Record<string, number>;
      value30DaysAgo: Record<string, number>;
    }
  | {
      channelId: number;
      updatedAt: number;
      kind: ChannelStatsKind.VIEW | ChannelStatsKind.SUBSCRIBER;
      value: number;
      value1DayAgo: number;
      value7DaysAgo: number;
      value30DaysAgo: number;
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
  debutedAt: number | null;
  retiredAt: number | null;
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
