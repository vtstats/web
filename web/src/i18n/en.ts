import type { Translations } from "./data";

import locale from "@angular/common/locales/en";
import dateFnsLocale from "date-fns/locale/en-US";

const translations: Translations = {
  // UI
  updatedAt: "Updated at {$INTERPOLATION}",
  name: "Name",
  total: "Total",
  subscribers: "Subscribers",
  views: "Views",
  lastDay: "Last Day",
  last7Days: "Last 7 Days",
  last30Days: "Last 30 Days",
  youtubeChannel: "YouTube Channel",
  bilibiliChannel: "Bilibili Channel",
  youtubeStream: "YouTube Stream",
  youtubeSchedule: "YouTube Schedule",
  settings: "Settings",
  toggleDarkMode: "Toggle Dark Mode",
  averageViewers: "Average Viewers",
  maximumViewers: "Maximum Viewers",
  streamHasEnded: "Stream has ended",
  streaming: "Streaming",
  streamStartTime: "Start Time",
  streamDuration: "Duration",
  youtubeSubscribers: "YouTube Subscribers",
  bilibiliSubscribers: "Bilibili Subscribers",
  youtubeViews: "YouTube Views",
  bilibiliViews: "Bilibili Views",
  vtuberSelected: "VTuber Selected",
  selectLanguage: "Select Language",
  recentStreams: "Recent Streams",
  streamViewers: "Stream Viewers",

  // VTubers
  miru: "杏仁ミル Annin Miru",
  ubye: "悠白 Ubye",
  hoonie: "β虎妮 Hoonie friends",
  rayer: "蕾兒 Rayer",
  rana: "鳥羽樂奈 TobaRana",
  shaya: "莎亞 Shaya",
  ruroro: "璐洛洛 Ruroro",
  kwakon: "小空 KITSUNEKON",
  ikusen: "いくせん Ikusen",
  aoi: "夏日葵",
  usagi: "兔姬 USAGIHIME CLUB.",
  haruka: "星見遙 Haruka",
  tsmatch: "火柴 TSMATCH",
  tedobear: "虛擬熊頭 TedoBear",
  kurita: "鼠屋栗太 Kurita",
  asa: "Asa Ifrit Ch.",
  kaina: "灰名 Kaina",
  nyoro: "香草奈若 Vanilla Nyoro",
  yuna: "水野魚娜 Mizuno yuna",
  yumemi: "雲之上夢見 YumemiChannel",

  // Batches
  yahoo: "Yahoo",
  yenz: "艷世設計 YENZdesign",
  cyberlive: "CyberLive",
  acg: "ACG稽查員 ACGInspector",
  kolhunter: "網紅獵人 KOL Hunter",
  acclaim: "Acclaim 事務所",
};

export { locale, dateFnsLocale, translations };
