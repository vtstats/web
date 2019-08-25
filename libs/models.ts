export type VTuber = {
  id: string;
  bilibili: number;
  youtube: string;
  twitter: string;
  name: string;
};

export type VTuberGroup = {
  id: string;
  name: string;
  members: VTuber[];
};

export type VTuberDocument = VTuber & {
  bilibiliStats: {
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
  };
  youtubeStats: {
    subs: number;
    views: number;
    dailySubs: number;
    dailyViews: number;
  };
  updatedAt: Date;
};

export type Stat = {
  t: string;
  v: number;
};

export type VTuberStats = VTuberDocument & {
  bilibiliSubStats: { [id: number]: number };
  bilibiliViewStats: { [id: number]: number };
  youtubeSubStats: { [id: number]: number };
  youtubeViewStats: { [id: number]: number };
};
