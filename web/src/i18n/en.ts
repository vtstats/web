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
  selectDate: "Select Date",
  noStream: "No stream on {$PH}",
  streamTimeOn: "Stream {$PH} on {$PH_1}",
  streamTimes: "Stream Times",

  // VTubers
  hololive: "Hololive Official",
  yagoo: "YAGOO",
  sora: "Tokino Sora",
  roboco: "Roboco",
  miko: "Sakura Miko",
  suisei: "Hoshimachi Suisei",
  fubuki: "Shirakami Fubuki",
  matsuri: "Natsuiro Matsuri",
  haato: "Akai Haato",
  aki: "Aki Rosenthal",
  mel: "Yozora Mel",
  choco: "Yuzuki Choco",
  choco_alt: "Yuzuki Choco Sub",
  shion: "Murasaki Shion",
  aqua: "Minato Aqua",
  subaru: "Oozora Subaru",
  ayame: "Nakiri Ayame",
  pekora: "Usada Pekora",
  rushia: "Uruha Rushia",
  flare: "Shiranui Flare",
  marine: "Houshou Marine",
  noel: "Shirogane Noel",
  kanata: "Amane Kanata",
  coco: "Kiryu Coco",
  watame: "Tsunomaki Watame",
  towa: "Tokoyami Towa",
  himemoriluna: "Himemori Luna",
  lamy: "Yukihana Lamy",
  nene: "Momosuzu Nene",
  botan: "Shishiro Botan",
  polka: "Omaru Polka",
  mio: "Ookami Mio",
  okayu: "Nekomata Okayu",
  korone: "Inugami Korone",
  azki: "AZKi",
  risu: "Ayunda Risu",
  moona: "Moona Hoshinova",
  iofi: "Airani Iofifteen",
  ollie: "Kureiji Ollie",
  melfissa: "Anya Melfissa",
  reine: "Pavolia Reine",
  amelia: "Watson Amelia",
  calliope: "Mori Calliope",
  gura: "Gawr Gura",
  inanis: "Ninomae Ina'nis",
  kiara: "Takanashi Kiara",
  irys: "IRyS",
  sana: "Tsukumo Sana",
  ceres: "Ceres Fauna",
  ouro: "Ouro Kronii",
  mumei: "Nanashi Mumei",
  hakos: "Hakos Baelz",
  luna: "Kaguya Luna",
  nekomiya: "Nekomiya Hinata",
  tamaki: "Inuyama Tamaki",
  ayamy: "Ayamy",
  nabi: "Aoi Nabi",
  pochimaru: "Pochimaru",
  nana: "Kagura Nana",
  ui: "Shigure Ui",
  miyabi: "Hanasaki Miyabi",
  izuru: "Kanade Izuru",
  aruran: "Arurandeisu",
  rikka: "Rikka",
  astel: "Astel Leda",
  temma: "Kishido Temma",
  roberu: "Yukoku Roberu",
  shien: "Kageyama Shien",
  oga: "Aragami Oga",

  // Batches
  hololive_og: "Hololive Talents",
  hololive_1st: "Hololive 1st Gen",
  hololive_2nd: "Hololive 2nd Gen",
  hololive_3rd: "Hololive 3rd Gen",
  hololive_4th: "Hololive 4th Gen",
  hololive_5th: "Hololive 5th Gen",
  hololive_gamers: "Hololive Gamers",
  innk_music: "Innk Music",
  hololive_id_1st: "Hololive Indonesia 1st Gen",
  hololive_id_2nd: "Hololive Indonesia 2nd Gen",
  hololive_en_myth: "Hololive English -Myth-",
  hololive_en_vsinger: "Hololive English VSinger",
  hololive_en_council: "Hololive English -Council-",
  holostars_1st: "Holostars 1st Gen",
  holostars_2nd: "Holostars 2nd Gen",
  holostars_3rd: "Holostars 3rd Gen",
  others: "Others",
};

export { locale, dateFnsLocale, translations };
