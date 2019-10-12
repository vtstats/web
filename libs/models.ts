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
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
    weeklySubs: number;
    weeklyViews: number;
  };
  youtubeStats: {
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
    weeklySubs: number;
    weeklyViews: number;
  };
};

export type VTuberGroup = {
  id: string;
  name: string;
  members: VTuberInfo[];
};

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
  updatedAt: string;
  streams: Array<Stream>;
};

export type StreamDetailResponse = Stream & {
  stats: { [time: number]: number };
};

export type VTubersListResponse = {
  updatedAt: string;
  vtubers: Array<VTuber>;
};

export type VTuberDetailResponse = VTuber & {
  stats: { [time: string]: [number, number, number, number] };
};
