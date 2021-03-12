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
  aoi: "夏日葵",
  asa: "Asa Ifrit Ch.",
  fengxu: "風絮 FengXu Ch.",
  fifteen: "十五號 No.Fifteen",
  fujinokuma: "藤乃熊 Fujinokuma",
  haruka: "星見遙 Haruka",
  himemiyayuka: "姬宮優花 Himemiya Yuka",
  hoonie: "β虎妮 Hoonie friends",
  ikusen: "いくせん Ikusen",
  kaina: "灰名 Kaina",
  kurita: "鼠屋栗太 Kurita",
  kwakon: "小空 KITSUNEKON",
  lapis: "綾賢ラピス Ryoken Lapis",
  lumina: "Lumina",
  miru: "杏仁ミル Annin Miru",
  nyoro: "香草奈若 Vanilla Nyoro",
  pedko: "平平子 Padko",
  rana: "鳥羽樂奈 TobaRana",
  rayer: "蕾兒 Rayer",
  ruroro: "璐洛洛 Ruroro",
  sanmou: "三毛毛毛 SanMou",
  shaya: "莎亞 Shaya",
  tedobear: "虛擬熊頭 TedoBear",
  tedobear2: "泰多貝亞 TedoBear",
  tsmatch: "火柴 TSMATCH",
  ubye: "悠白 Ubye",
  usagi: "兔姬 USAGIHIME CLUB.",
  yumemi: "雲之上夢見 YumemiChannel",
  yuna: "水野魚娜 Mizuno yuna",

  // Batches
  acclaim: "Acclaim 事務所",
  acg: "ACG稽查員 ACGInspector",
  changing: "春魚工作室",
  cyberlive: "CyberLive",
  fourvirtual: "4virtual",
  hinet: "HiNet 光世代",
  kolhunter: "網紅獵人 KOL Hunter",
  yahoo: "Yahoo",
  yenz: "艷世設計 YENZdesign",
};

export default translations;

export { locale, dateFnsLocale, translations };
