export type VTuber = {
  id: string;
  bilibiliStats: {
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
    weeklySubs: number;
    weeklyViews: number;
    monthlySubs: number;
    monthlyViews: number;
  };
  youtubeStats: {
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
    weeklySubs: number;
    weeklyViews: number;
    monthlySubs: number;
    monthlyViews: number;
  };
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

export type StreamsList = {
  updatedAt: string;
  streams: Array<Stream>;
};

export type StreamDetail = Stream & {
  stats: { [time: number]: number };
};

export type VTubersList = {
  updatedAt: string;
  vtubers: Array<VTuber>;
};

export type VTuberDetail = VTuber & {
  stats: { [time: string]: [number, number, number, number] };
};
