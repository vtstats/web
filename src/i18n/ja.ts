// Japanese (ja)

export { default as locale } from "@angular/common/locales/ja";
export { default as dateFnsLocale } from "date-fns/locale/ja";

import { VSTATS_DISCORD_URL } from "src/constants/misc";
import type { translations as t } from "./messages.json";

// NOTE: SOME TRANSLATIONS ARE TRANSLATED USING DEEPL, WHICH WILL BE SIDENOTED RIGHT NEXT TO.
// SO EXPECT THE QUALITY WOULDN'T BE DECENT. IF YOU ARE CONFIDENT WITH YOUR LANGUAGE, FEEL FREE
// TO CHANGE THOSE FIELDS
export const translations: typeof t = {
  "updated-at": "更新時間: {$ INTERPOLATION}",
  "channel-no-results":
    "結果が表示されない場合は、少なくとも1つのVTuberを選択してください。", // TRANSLATED USING DEEPL
  "select-vtuber": "VTuberを選択", // TRANSLATED USING DEEPL
  name: "名前",
  total: "合計",
  subscribers: "登録者数",
  views: "再生回数",
  compare: "比較する", // TRANSLATED USING DEEPL
  "last-day": "過去 1 日",
  "last-7days": "過去 7 日",
  "last-30days": "過去 30 日",
  "page-not-found": "ページが見つかりません", // TRANSLATED USING DEEPL
  "page-not-found-desc": "でも、わためは何も悪くない。", // TRANSLATED USING DEEPL
  channel: "チャネル",
  stream: "配信",
  "live-stream": "ライブ",
  scheduled: "予定",
  settings: "設定",
  "toggle-dark-mode": "ダークテーマに切り替える",
  general: "general",
  "average-viewers": "平均的な視聴者",
  "maximum-viewers": "最大視聴者数",
  "discord-channel": "Discordチャンネル", // TRANSLATED USING DEEPL
  // streamHasEnded: "配信終了",
  // streaming: "配信中",
  // streamStartTime: "開始時間",
  // streamDuration: "間隔",
  // vtuberSelected: "Vtuber を選択し",
  "select-language": "言語を選択",
  "recent-streams": "最近の配信",
  "stream-viewers": "配信視聴者",
  "page-under-construction": "建設中のページ", // TRANSLATED USING DEEPL
  "page-under-construction-desc":
    "このセクションは現在開発中で、間もなく公開される予定だ。", // TRANSLATED USING DEEPL
  "select-date": "日付を選択し",
  "no-stream": "配信なし",
  // streamTimeOn: "{$ INTERPOLATION_1}: 配信時間 {$ INTERPOLATION}",
  "stream-times": "配信時間",
  "live-chat": "チャット",
  "no-data": " データなし ", // TRANSLATED USING DEEPL
  today: "今日",
  yesterday: "昨日",
  tomorrow: "明日",
  "this-week": "今週",
  "this-month": "今月",
  "this-year": "今年",
  future: "未来",
  revenue: "收入",
  about: "について", // TRANSLATED USING DEEPL
  "about-1": "vtstatsはVTuber統計とデータ可視化のためのプラットフォームです。", // TRANSLATED USING DEEPL
  "about-2":
    "これはオープンソースのプロジェクトであり、ソースコードは {$START_LINK}GitHub{$CLOSE_LINK} にあります。", // TRANSLATED USING DEEPL
  "about-3":
    "このウェブサイトがお役に立つとお感じになった方は、以下の方法で寄付による支援をご検討ください。", // TRANSLATED USING DEEPL
  "about-4": `{$START_LINK}${VSTATS_DISCORD_URL}{$CLOSE_LINK}のDiscordサーバーに参加してください。`, // TRANSLATED USING DEEPL
  "about-5":
    "{$START_LINK}YouTube嫌いを返す{$CLOSE_LINK}は、Youtubeの 好き／嫌い のデータを提供してくれました。", // TRANSLATED USING DEEPL
  "filter-by-vtuber": "VTuberで絞り込む", // TRANSLATED USING DEEPL
  clear: "クリア", // TRANSLATED USING DEEPL
  misc: "その他", // TRANSLATED USING DEEPL
  "super-chats": "Super Chat",
  "super-sticker": "Super Stickers",
  "new-member": "新規会員", // TRANSLATED USING DEEPL
  "member-milestone": "メンバーのマイルストーン", // TRANSLATED USING DEEPL
  cheering: "Cheering", // TRANSLATED USING DEEPL
  timed: "時間指定", // TRANSLATED USING DEEPL
  "start-time": "開始時間", // TRANSLATED USING DEEPL
  "end-time": "終了時間", // TRANSLATED USING DEEPL
  duration: "期間", // TRANSLATED USING DEEPL
  "avg-max-viewers": "平均視聴者数/最高視聴者数", // TRANSLATED USING DEEPL
  "likes-and-dislikes": " 好き／嫌い ", // TRANSLATED USING DEEPL
  "like-dislike-tooltip": "提供：Return YouTube Dislike", // TRANSLATED USING DEEPL
  "revenue-tooltip-1": "のみが含まれる", // TRANSLATED USING DEEPL
  "revenue-tooltip-youtube": "YouTube Super Chat と Super Sticker", // TRANSLATED USING DEEPL
  "revenue-tooltip-twitch": "Twitch Cheering と Hyper Chat", // TRANSLATED USING DEEPL
  member: "メンバー",
  "hyper-chat": "Hyper Chat", // TRANSLATED USING DEEPL
  count: "カウント", // TRANSLATED USING DEEPL
  value: "価値", // TRANSLATED USING DEEPL
  search: "検索",
  currency: "通貨", // TRANSLATED USING DEEPL
  "display-language": "表示言語", // TRANSLATED USING DEEPL
  "name-language": "言語", // TRANSLATED USING DEEPL
  "native-name-label": "ネイティブ (e.g. 白上フブキ, Mori Calliope)", // TRANSLATED USING DEEPL
  "english-name-label": "英語 (e.g. Shirakami Fubuki, Mori Calliope)",
  "japanese-name-label": "日本語 (e.g. 白上フブキ, 森カリオペ)",
  appearance: "外観", // TRANSLATED USING DEEPL
  language: "言語", // TRANSLATED USING DEEPL
  region: "地域", // TRANSLATED USING DEEPL
  vtuber: "VTuber",
  "yt-account": "YouTubeアカウント", // TRANSLATED USING DEEPL
  theme: "テーマ", // TRANSLATED USING DEEPL
  "theme-sys-default-label": "システムのデフォルト", // TRANSLATED USING DEEPL
  "theme-light": "ライト", // TRANSLATED USING DEEPL
  "theme-dark": "ダーク", // TRANSLATED USING DEEPL
  "on-air": "オンエア", // TRANSLATED USING DEEPL
  timezone: "タイムゾーン", // TRANSLATED USING DEEPL
  none: "なし", // TRANSLATED USING DEEPL
  filters: "フィルター", // TRANSLATED USING DEEPL
  "show-retired": "卒業/終端のVTuberを表示", // TRANSLATED USING DEEPL
  "selected-vtuber-per-total":
    "{$INTERPOLATION_1}のうち{$INTERPOLATION}を選択。\n", // TRANSLATED USING DEEPL
  // streamLikes: "高く評価",
  "currency-gbp": "UKポンド",
  "currency-jpy": "円",
  "currency-krw": "韓国ウォン",
  "currency-ils": "新シェケル",
  "currency-eur": "ユーロ",
  "currency-php": "フィリピン・ペソ",
  "currency-inr": "インド・ルピー",
  "currency-usd": "USドル",
  "currency-aud": "オーストラリア・ドル",
  "currency-aed": "UAEディルハム",
  "currency-ars": "アルゼンチン・ペソ",
  "currency-bam": "兌換マルク",
  "currency-bgn": "レフ",
  "currency-bob": "ボリビアーノ",
  "currency-byn": "ベラルーシ・ルーブル",
  "currency-cad": "カナダ・ドル",
  "currency-chf": "スイス・フラン",
  "currency-clp": "チリ・ペソ",
  "currency-cop": "コロンビア・ペソ",
  "currency-crc": "コスタリカ・コロン",
  "currency-czk": "チェコ・コルナ",
  "currency-dkk": "デンマーク・クローネ",
  "currency-egp": "エジプト・ポンド",
  "currency-gtq": "ケツァル",
  "currency-hkd": "香港ドル",
  "currency-hnl": "レンピラ",
  "currency-hrk": "クーナ",
  "currency-huf": "フォリント",
  "currency-isk": "アイスランド・クローナ",
  "currency-mxn": "メキシコ・ペソ",
  "currency-myr": "リンギット",
  "currency-nio": "コルドバ",
  "currency-nok": "ノルウェー・クローネ",
  "currency-twd": "ニュー台湾ドル",
  "currency-nzd": "ニュージーランド・ドル",
  "currency-pen": "ヌエボ・ソル",
  "currency-pln": "ズウォティ",
  "currency-brl": "レアル",
  "currency-ron": "ルーマニア・レウ",
  "currency-rsd": "セルビア・ディナール",
  "currency-rub": "ロシア・ルーブル",
  "currency-sar": "サウジアラビア・リヤル",
  "currency-sek": "スウェーデン・クローナ",
  "currency-sgd": "シンガポール・ドル",
  "currency-try": "トルコリラ",
  "currency-zar": "ランド",
  "currency-afn": "Afghan Afghani",
  "currency-all": "Albanian Lek",
  "currency-amd": "Armenian Dram",
  "currency-ang": "Netherlands Antillean Guilder",
  "currency-aoa": "Angolan Kwanza",
  "currency-awg": "Aruban Florin",
  "currency-azn": "Azerbaijani Manat",
  "currency-bbd": "Barbadian Dollar",
  "currency-bdt": "Bangladeshi Taka",
  "currency-bhd": "Bahraini Dinar",
  "currency-bif": "Burundian Franc",
  "currency-bmd": "Bermudan Dollar",
  "currency-bnd": "Brunei Dollar",
  "currency-bsd": "Bahamian Dollar",
  "currency-btc": "Bitcoin",
  "currency-btn": "Bhutanese Ngultrum",
  "currency-bwp": "Botswanan Pula",
  "currency-bzd": "Belize Dollar",
  "currency-cdf": "Congolese Franc",
  "currency-clf": "Chilean Unit of Account (UF)",
  "currency-cny": "Chinese Yuan",
  "currency-cuc": "Cuban Convertible Peso",
  "currency-cup": "Cuban Peso",
  "currency-cve": "Cape Verdean Escudo",
  "currency-djf": "Djiboutian Franc",
  "currency-dop": "Dominican Peso",
  "currency-dzd": "Algerian Dinar",
  "currency-ern": "Eritrean Nakfa",
  "currency-etb": "Ethiopian Birr",
  "currency-fjd": "Fijian Dollar",
  "currency-fkp": "Falkland Islands Pound",
  "currency-gel": "Georgian Lari",
  "currency-ggp": "Guernsey Pound",
  "currency-ghs": "Ghanaian Cedi",
  "currency-gip": "Gibraltar Pound",
  "currency-gmd": "Gambian Dalasi",
  "currency-gnf": "Guinean Franc",
  "currency-gyd": "Guyanaese Dollar",
  "currency-htg": "Haitian Gourde",
  "currency-idr": "Indonesian Rupiah",
  "currency-imp": "Manx pound",
  "currency-iqd": "Iraqi Dinar",
  "currency-irr": "Iranian Rial",
  "currency-jep": "Jersey Pound",
  "currency-jmd": "Jamaican Dollar",
  "currency-jod": "Jordanian Dinar",
  "currency-kes": "Kenyan Shilling",
  "currency-kgs": "Kyrgystani Som",
  "currency-khr": "Cambodian Riel",
  "currency-kmf": "Comorian Franc",
  "currency-kpw": "North Korean Won",
  "currency-kwd": "Kuwaiti Dinar",
  "currency-kyd": "Cayman Islands Dollar",
  "currency-kzt": "Kazakhstani Tenge",
  "currency-lak": "Laotian Kip",
  "currency-lbp": "Lebanese Pound",
  "currency-lkr": "Sri Lankan Rupee",
  "currency-lrd": "Liberian Dollar",
  "currency-lsl": "Lesotho Loti",
  "currency-lyd": "Libyan Dinar",
  "currency-mad": "Moroccan Dirham",
  "currency-mdl": "Moldovan Leu",
  "currency-mga": "Malagasy Ariary",
  "currency-mkd": "Macedonian Denar",
  "currency-mmk": "Myanma Kyat",
  "currency-mnt": "Mongolian Tugrik",
  "currency-mop": "Macanese Pataca",
  "currency-mru": "Mauritanian Ouguiya",
  "currency-mur": "Mauritian Rupee",
  "currency-mvr": "Maldivian Rufiyaa",
  "currency-mwk": "Malawian Kwacha",
  "currency-mzn": "Mozambican Metical",
  "currency-nad": "Namibian Dollar",
  "currency-ngn": "Nigerian Naira",
  "currency-npr": "Nepalese Rupee",
  "currency-omr": "Omani Rial",
  "currency-pab": "Panamanian Balboa",
  "currency-pgk": "Papua New Guinean Kina",
  "currency-pkr": "Pakistani Rupee",
  "currency-pyg": "Paraguayan Guarani",
  "currency-qar": "Qatari Rial",
  "currency-rwf": "Rwandan Franc",
  "currency-sbd": "Solomon Islands Dollar",
  "currency-scr": "Seychellois Rupee",
  "currency-sdg": "Sudanese Pound",
  "currency-shp": "Saint Helena Pound",
  "currency-sll": "Sierra Leonean Leone",
  "currency-sos": "Somali Shilling",
  "currency-srd": "Surinamese Dollar",
  "currency-ssp": "South Sudanese Pound",
  "currency-stn": "Sao Tomean Dobra",
  "currency-svc": "Salvadoran Colón",
  "currency-syp": "Syrian Pound",
  "currency-szl": "Swazi Lilangeni",
  "currency-thb": "Thai Baht",
  "currency-tjs": "Tajikistani Somoni",
  "currency-tmt": "Turkmenistani Manat",
  "currency-tnd": "Tunisian Dinar",
  "currency-top": "Tongan Pa'anga",
  "currency-ttd": "Trinidad and Tobago Dollar",
  "currency-tzs": "Tanzanian Shilling",
  "currency-uah": "Ukrainian Hryvnia",
  "currency-ugx": "Ugandan Shilling",
  "currency-uyu": "Uruguayan Peso",
  "currency-uzs": "Uzbekistan Som",
  "currency-ves": "Venezuelan Bolívar",
  "currency-vnd": "Vietnamese Dong",
  "currency-vuv": "Vanuatu Vatu",
  "currency-wst": "Samoan Tala",
  "currency-xaf": "CFA Franc BEAC",
  "currency-xag": "Silver Ounce",
  "currency-xau": "Gold Ounce",
  "currency-xcd": "East Caribbean Dollar",
  "currency-xdr": "Special Drawing Rights",
  "currency-xof": "CFA Franc BCEAO",
  "currency-xpd": "Palladium Ounce",
  "currency-xpf": "CFP Franc",
  "currency-xpt": "Platinum Ounce",
  "currency-yer": "Yemeni Rial",
  "currency-zmw": "Zambian Kwacha",
  "currency-zwl": "Zimbabwean Dollar",
};
