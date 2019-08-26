export type VTuberInfo = {
  id: string;
  group?: string;
  bilibili: number;
  name: string;
  twitter: string;
  youtube: string;
};

export type VTuber = VTuberInfo & {
  bilibiliStats: {
    dailySubs: number;
    dailyViews: number;
    subs: number;
    views: number;
  };
  youtubeStats: {
    dailySubs: number;
    dailyViews: number;
    subs: number;
    views: number;
  };
};

export type VTuberGroup = {
  id: string;
  name: string;
  members: VTuberInfo[];
};

export type Stat = { [id: number]: number };

export type LiveStream = {
  actualEndTime?: Date;
  actualStartTime?: Date;

  avgViewers: number;
  maxViewers: number;
  channelId: string;
  title: string;
  videoId: string;
  vtuberId: string;
};

export type StreamsResponse = {
  updatedAt: Date;
  streams: Array<LiveStream>;
};

export type StreamDetailResponse = LiveStream & { stats: Stat };

export type VTubersResponse = {
  updatedAt: Date;
  vtubers: Array<VTuber>;
};

export type VTuberDetailResponse = VTuber & {
  bilibiliSubs: Stat;
  bilibiliViews: Stat;
  youtubeSubs: Stat;
  youtubeViews: Stat;
};

export type StreamsUpdateRequest = Array<{
  id: string;
  title: string;
  vtuber: string;
}>;

export type VTubersUpdateRequest = Array<{
  id: string;
  views: number;
  subs: number;
}>;
