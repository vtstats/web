export type VTuber = {
  id: string;
  name: string;
  twitter: string;
  youtube: string | null;
  bilibili: number | null;
  default: boolean;
};

export type Channel = {
  kind: "youtube" | "bilibili";

  vtuberId: string;

  subscriberCount: number;
  dailySubscriberCount: number;
  weeklySubscriberCount: number;
  monthlySubscriberCount: number;

  viewCount: number;
  dailyViewCount: number;
  weeklyViewCount: number;
  monthlyViewCount: number;
};

export type ChannelListOption = {
  ids: Array<string>;
};

export type ChannelListResponse = {
  updatedAt: number;
  channels: Array<Channel>;
};

export type Stream = {
  streamId: string;
  title: string;
  vtuberId: string;
  thumbnailUrl: string;

  status: StreamStatus;

  scheduleTime?: number;
  startTime?: number;
  endTime?: number;

  averageViewerCount?: number;
  maxViewerCount?: number;
};

export type StreamGroup = {
  date: number;
  streams: Stream[];
};

export type StreamListOption = {
  ids: Array<string>;
  status: Array<StreamStatus>;
  orderBy?: StreamListOrderBy;
  startAt?: Date | number;
  endAt?: Date | number;
};

export const enum StreamListOrderBy {
  startTimeAsc = "start_time:asc",
  endTimeAsc = "end_time:asc",
  scheduleTimeAsc = "schedule_time:asc",
  startTimeDesc = "start_time:desc",
  endTimeDesc = "end_time:desc",
  scheduleTimeDesc = "schedule_time:desc",
}

export const enum StreamStatus {
  scheduled = "scheduled",
  live = "live",
  ended = "ended",
}

export type StreamListResponse = {
  updatedAt: number;
  streams: Array<Stream>;
};

export type Report<K> = {
  id: string;
  kind: K;
  rows: Array<[number, number]>;
};

export const enum StreamReportKind {
  youtubeStreamViewer = "youtube_stream_viewer",
}

export type StreamReportOption = {
  ids: Array<string>;
  metrics: Array<StreamReportKind>;
  startAt?: Date | number;
  endAt?: Date | number;
};

export type StreamReportResponse = {
  streams: Array<Stream>;
  reports: Array<Report<StreamReportKind>>;
};

export type ChannelReportOption = {
  ids: Array<string>;
  metrics: Array<ChannelReportKind>;
  startAt?: Date | number;
  endAt?: Date | number;
};

export const enum ChannelReportKind {
  youtubeChannelSubscriber = "youtube_channel_subscriber",
  youtubeChannelView = "youtube_channel_view",
  bilibiliChannelSubscriber = "bilibili_channel_subscriber",
  bilibiliChannelView = "bilibili_channel_view",
}

export type ChannelReportResponse = {
  channels: Array<Channel>;
  reports: Array<Report<ChannelReportKind>>;
};

export type StreamList = {
  loading: boolean;
  refresh: boolean;
  reachedEnd: boolean;
  streams: Array<Stream>;
  updatedAt: number;
};

export type StreamListLoadMoreOption = {
  refresh: boolean;
  last?: Stream;
};
