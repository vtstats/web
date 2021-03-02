import type { Translations } from "./data";

import locale from "@angular/common/locales/zh-Hant";
import dateFnsLocale from "date-fns/locale/zh-TW";

const translations: Translations = {
  // UI
  updatedAt: "更新於 {$INTERPOLATION}",
  name: "名稱",
  total: "總計",
  subscribers: "訂閱",
  views: "觀看",
  lastDay: "日增",
  last7Days: "週增",
  last30Days: "月增",
  youtubeChannel: "YouTube 頻道",
  bilibiliChannel: "Bilibili 頻道",
  youtubeStream: "YouTube 直播",
  youtubeSchedule: "YouTube 預定直播",
  settings: "設定",
  toggleDarkMode: "切換夜間模式",
  averageViewers: "平均同接",
  maximumViewers: "最高同接",
  streamHasEnded: "直播結束",
  streaming: "正在直播",
  streamStartTime: "開始時間",
  streamDuration: "持續時間",
  youtubeSubscribers: "YouTube 訂閱",
  bilibiliSubscribers: "Bilibili 訂閱",
  youtubeViews: "YouTube 觀看",
  bilibiliViews: "Bilibili 播放",
  vtuberSelected: "已選取的 VTuber",
  selectLanguage: "選擇語言",
  recentStreams: "近期直播",
  streamViewers: "直播同接",

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

export default translations;

export { locale, dateFnsLocale, translations };
