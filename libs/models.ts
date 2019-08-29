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

export type Stream = {
  start: string;
  end?: string;

  avgViewers?: number;
  maxViewers?: number;
  title: string;
  id: string;
  vtuberId: string;
};

export type StreamsListResponse = {
  total: number;
  updatedAt: string;
  streams: Array<Stream>;
};

export type StreamDetailResponse = Stream & { stats: Stat };

export type VTubersListResponse = {
  total: number;
  updatedAt: string;
  vtubers: Array<VTuber>;
};

export type VTuberDetailResponse = VTuber & {
  bilibiliSubs: Stat;
  bilibiliViews: Stat;
  youtubeSubs: Stat;
  youtubeViews: Stat;
};
