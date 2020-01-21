export type ChannelsResponse = {
  updatedAt: string;
  channels: Array<{
    id: string;
    subs: number;
    dailySubs: number;
    weeklySubs: number;
    monthlySubs: number;
    views: number;
    dailyViews: number;
    weeklyViews: number;
    monthlyViews: number;
  }>;
};

export type VTuberResponse = {
  id: string;
  vtuber: {
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
  series: { [time: number]: [number, number, number, number] };
};

export type StreamsResponse = {
  updatedAt: string;
  hasMore: boolean;
  streams: Array<{
    id: string;
    title: string;
    vtuberId: string;
    start: string;
    end?: string;
    avgViewers?: number;
    maxViewers?: number;
  }>;
};

export type StreamResponse = {
  stream: {
    id: string;
    title: string;
    avgViewers: number;
    maxViewers: number;
    end: string;
    start: string;
    vtuberId: string;
  };
  series: { [time: number]: number };
};
