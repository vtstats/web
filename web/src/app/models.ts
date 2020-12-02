export type VTuber = {
  id: string;
  name: string;
  twitter: string;
  youtube?: string;
  bilibili?: number;
  default: boolean;
};

export type Channel = {
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

export type ChannelListResponse = {
  updatedAt: string;
  channels: Array<Channel>;
};

export type Stream = {
  streamId: string;
  title: string;
  vtuberId: string;
  thumbnailUrl: string;

  scheduleTime?: string;
  startTime?: string;
  endTime?: string;

  averageViewerCount?: number;
  maxViewerCount?: number;
};

export type StreamListResponse = {
  updatedAt: string;
  streams: Array<Stream>;
};

export type Report<K> = {
  id: string;
  kind: K;
  rows: Array<[string, number]>;
};

export enum StreamReportKind {
  youtube_stream_viewer = "youtube_stream_viewer",
}

export type StreamReportResponse = {
  streams: Array<Stream>;
  reports: Array<Report<StreamReportKind>>;
};

export enum ChannelReportKind {
  youtube_channel_subscriber = "youtube_channel_subscriber",
  youtube_channel_view = "youtube_channel_view",
  bilibili_channel_subscriber = "bilibili_channel_subscriber",
  bilibili_channel_view = "bilibili_channel_view",
}

export type ChannelReportResponse = {
  channels: Array<Channel>;
  reports: Array<Report<ChannelReportKind>>;
};
