import { vtubers, batches } from "vtubers";

export type MessageIds =
  | "updatedAt"
  | "name"
  | "total"
  | "subscribers"
  | "views"
  | "lastDay"
  | "last7Days"
  | "last30Days"
  | "youtubeChannel"
  | "bilibiliChannel"
  | "youtubeStream"
  | "youtubeSchedule"
  | "settings"
  | "toggleDarkMode"
  | "averageViewers"
  | "maximumViewers"
  | "streamHasEnded"
  | "streaming"
  | "streamStartTime"
  | "streamDuration"
  | "youtubeSubscribers"
  | "bilibiliSubscribers"
  | "youtubeViews"
  | "bilibiliViews"
  | "vtuberSelected"
  | "selectLanguage"
  | "recentStreams"
  | keyof typeof vtubers
  | keyof typeof batches;

export type Translations = Record<MessageIds, string>;
