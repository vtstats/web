import { VTuberIds, BatchIds } from "vtubers";

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
  | "streamViewers"
  | VTuberIds
  | BatchIds;

export type Translations = Record<MessageIds, string>;
