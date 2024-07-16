// Korean (ko)

export { default as locale } from "@angular/common/locales/ko";
export { default as dateFnsLocale } from "date-fns/locale/ko";

import { VSTATS_DISCORD_URL } from "src/constants/misc";
import type { translations as t } from "./messages.json";

// NOTE: SOME TRANSLATIONS ARE TRANSLATED USING DEEPL, WHICH WILL BE SIDENOTED RIGHT NEXT TO.
// SO EXPECT THE QUALITY WOULDN'T BE DECENT. IF YOU ARE CONFIDENT WITH YOUR LANGUAGE, FEEL FREE
// TO CHANGE THOSE FIELDS
export const translations: typeof t = {
  "channel-no-results":
    "결과가 없는 경우, 적어도 한 명의 VTuber를 선택해 보세요.", // TRANSLATED USING DEEPL
  "select-vtuber": "Select VTuber", // TRANSLATED USING DEEPL
  name: "이름", // TRANSLATED USING DEEPL
  total: "합계", // TRANSLATED USING DEEPL
  subscribers: "구독자", // TRANSLATED USING DEEPL
  views: "조회수", // TRANSLATED USING DEEPL
  compare: "비교", // TRANSLATED USING DEEPL
  "last-day": "마지막 날", // TRANSLATED USING DEEPL
  "last-7days": "지난 7일", // TRANSLATED USING DEEPL
  "last-30days": "지난 30일", // TRANSLATED USING DEEPL
  "page-not-found": "페이지를 찾을 수 없습니다.", // TRANSLATED USING DEEPL
  "page-not-found-desc": "하지만 와타메는 잘못한 것이 없습니다.", // TRANSLATED USING DEEPL
  settings: "설정", // TRANSLATED USING DEEPL
  "toggle-dark-mode": "다크 모드 전환", // TRANSLATED USING DEEPL
  general: "일반", // TRANSLATED USING DEEPL
  "average-viewers": "평균 시청자 수", // TRANSLATED USING DEEPL
  "maximum-viewers": "최대 시청자 수", // TRANSLATED USING DEEPL
  "discord-channel": "Discord 채널", // TRANSLATED USING DEEPL
  "no-stream": "스트림 없음", // TRANSLATED USING DEEPL
  "stream-times": "스트리밍 시간", // TRANSLATED USING DEEPL
  "live-chat": "라이브 채팅", // TRANSLATED USING DEEPL
  "no-data": " 데이터 없음 ", // TRANSLATED USING DEEPL
  today: "오늘", // TRANSLATED USING DEEPL
  yesterday: "어제", // TRANSLATED USING DEEPL
  tomorrow: "내일", // TRANSLATED USING DEEPL
  "this-week": "이번 주", // TRANSLATED USING DEEPL
  "this-month": "이번 달", // TRANSLATED USING DEEPL
  "this-year": "올해", // TRANSLATED USING DEEPL
  future: "미래", // TRANSLATED USING DEEPL
  "select-language": "언어 선택", // TRANSLATED USING DEEPL
  "stream-viewers": "스트림 시청자", // TRANSLATED USING DEEPL
  "page-under-construction": "페이지 구성 중", // TRANSLATED USING DEEPL
  "page-under-construction-desc":
    "이 섹션은 현재 개발 중이며 곧 출시될 예정입니다.", // TRANSLATED USING DEEPL
  revenue: "수익", // TRANSLATED USING DEEPL
  "recent-streams": "최근 스트림", // TRANSLATED USING DEEPL
  "select-date": "날짜 선택", // TRANSLATED USING DEEPL
  about: "약", // TRANSLATED USING DEEPL
  "about-1": "vtstats는 VTuber의 통계 및 데이터 시각화를 위한 플랫폼입니다.", // TRANSLATED USING DEEPL
  "about-2":
    "이 프로젝트는 오픈 소스 프로젝트이며, 소스 코드는 {$START_LINK}GitHub{$CLOSE_LINK}에서 찾을 수 있습니다.", // TRANSLATED USING DEEPL
  "about-3":
    "이 웹사이트가 유용하다고 생각되면 다음과 같은 방법으로 기부를 통해 웹사이트를 지원하는 것을 고려해 보세요", // TRANSLATED USING DEEPL
  "about-4": `Discord 서버는 {$START_LINK}${VSTATS_DISCORD_URL}{$CLOSE_LINK}에서 가입하세요. `,
  "about-5":
    "유튜브 좋아요/싫어요 데이터를 제공한 {$START_LINK}Return YouTube Dislike{$CLOSE_LINK}에 크레딧이 돌아갑니다.", // TRANSLATED USING DEEPL
  misc: "기타", // TRANSLATED USING DEEPL
  "filter-by-vtuber": "VTuber별 필터링", // TRANSLATED USING DEEPL
  clear: "명확한", // TRANSLATED USING DEEPL
  "live-stream": "라이브", // TRANSLATED USING DEEPL
  scheduled: "예약", // TRANSLATED USING DEEPL
  "updated-at": "업데이트된 {$INTERPOLATION}", // TRANSLATED USING DEEPL
  stream: "스트림", // TRANSLATED USING DEEPL
  channel: "채널", // TRANSLATED USING DEEPL
  "super-chats": "슈퍼 채팅", // TRANSLATED USING DEEPL
  "super-sticker": "슈퍼 스티커", // TRANSLATED USING DEEPL
  "new-member": "새 회원", // TRANSLATED USING DEEPL
  "member-milestone": "회원 마일스톤", // TRANSLATED USING DEEPL
  cheering: "응원", // TRANSLATED USING DEEPL
  timed: "시간 제한", // TRANSLATED USING DEEPL
  "start-time": "시작 시간", // TRANSLATED USING DEEPL
  "end-time": "종료 시간", // TRANSLATED USING DEEPL
  duration: "기간", // TRANSLATED USING DEEPL
  "avg-max-viewers": "평균/최대 시청자 수", // TRANSLATED USING DEEPL
  "likes-and-dislikes": " 좋아요 / 싫어요 ", // TRANSLATED USING DEEPL
  "like-dislike-tooltip": "Return YouTube Dislike 제공", // TRANSLATED USING DEEPL
  "revenue-tooltip-1": "만 포함합니다", // TRANSLATED USING DEEPL
  "revenue-tooltip-youtube": "YouTube 슈퍼 채팅 및 슈퍼 스티커", // TRANSLATED USING DEEPL
  "revenue-tooltip-twitch": "Twitch 응원 및 하이퍼 채팅", // TRANSLATED USING DEEPL
  member: "회원", // TRANSLATED USING DEEPL
  "hyper-chat": "하이퍼 채팅", // TRANSLATED USING DEEPL
  count: "카운트", // TRANSLATED USING DEEPL
  value: "값", // TRANSLATED USING DEEPL
  search: "검색", // TRANSLATED USING DEEPL
  "on-air": "방송 중", // TRANSLATED USING DEEPL
  currency: "통화", // TRANSLATED USING DEEPL
  "display-language": "표시 언어", // TRANSLATED USING DEEPL
  "name-language": "이름 언어", // TRANSLATED USING DEEPL
  "native-name-label": "네이티브 (e.g. 白上フブキ, Mori Calliope)", // TRANSLATED USING DEEPL
  "english-name-label": "영어 (e.g. Shirakami Fubuki, Mori Calliope)", // TRANSLATED USING DEEPL
  "japanese-name-label": "일본어 (e.g. 白上フブキ, 森カリオペ)", // TRANSLATED USING DEEPL
  appearance: "모양", // TRANSLATED USING DEEPL
  language: "랑구개", // TRANSLATED USING DEEPL
  region: "지역", // TRANSLATED USING DEEPL
  vtuber: "VTuber", // TRANSLATED USING DEEPL
  "yt-account": "YouTube 계정", // TRANSLATED USING DEEPL
  theme: "테마", // TRANSLATED USING DEEPL
  "theme-sys-default-label": "시스템 기본값", // TRANSLATED USING DEEPL
  "theme-light": "빛", // TRANSLATED USING DEEPL
  "theme-dark": "어두운", // TRANSLATED USING DEEPL
  timezone: "시간대", // TRANSLATED USING DEEPL
  none: "없음", // TRANSLATED USING DEEPL
  filters: "필터", // TRANSLATED USING DEEPL
  "show-retired": "졸업/종료된 VTuber 표시하기", // TRANSLATED USING DEEPL
  "selected-vtuber-per-total":
    "{$INTERPOLATION_1} 중 {$INTERPOLATION}을 선택했습니다.\n", // TRANSLATED USING DEEPL
  "currency-aed": "United Arab Emirates Dirham", // TRANSLATED USING DEEPL
  "currency-afn": "Afghan Afghani", // TRANSLATED USING DEEPL
  "currency-all": "Albanian Lek", // TRANSLATED USING DEEPL
  "currency-amd": "Armenian Dram", // TRANSLATED USING DEEPL
  "currency-ang": "Netherlands Antillean Guilder", // TRANSLATED USING DEEPL
  "currency-aoa": "Angolan Kwanza", // TRANSLATED USING DEEPL
  "currency-ars": "Argentine Peso", // TRANSLATED USING DEEPL
  "currency-aud": "Australian Dollar", // TRANSLATED USING DEEPL
  "currency-awg": "Aruban Florin", // TRANSLATED USING DEEPL
  "currency-azn": "Azerbaijani Manat", // TRANSLATED USING DEEPL
  "currency-bam": "Bosnia-Herzegovina Convertible Mark", // TRANSLATED USING DEEPL
  "currency-bbd": "Barbadian Dollar", // TRANSLATED USING DEEPL
  "currency-bdt": "Bangladeshi Taka", // TRANSLATED USING DEEPL
  "currency-bgn": "Bulgarian Lev", // TRANSLATED USING DEEPL
  "currency-bhd": "Bahraini Dinar", // TRANSLATED USING DEEPL
  "currency-bif": "Burundian Franc", // TRANSLATED USING DEEPL
  "currency-bmd": "Bermudan Dollar", // TRANSLATED USING DEEPL
  "currency-bnd": "Brunei Dollar", // TRANSLATED USING DEEPL
  "currency-bob": "Bolivian Boliviano", // TRANSLATED USING DEEPL
  "currency-brl": "Brazilian Real", // TRANSLATED USING DEEPL
  "currency-bsd": "Bahamian Dollar", // TRANSLATED USING DEEPL
  "currency-btc": "Bitcoin", // TRANSLATED USING DEEPL
  "currency-btn": "Bhutanese Ngultrum", // TRANSLATED USING DEEPL
  "currency-bwp": "Botswanan Pula", // TRANSLATED USING DEEPL
  "currency-byn": "Belarusian Ruble", // TRANSLATED USING DEEPL
  "currency-bzd": "Belize Dollar", // TRANSLATED USING DEEPL
  "currency-cad": "Canadian Dollar", // TRANSLATED USING DEEPL
  "currency-cdf": "Congolese Franc", // TRANSLATED USING DEEPL
  "currency-chf": "Swiss Franc", // TRANSLATED USING DEEPL
  "currency-clf": "Chilean Unit of Account (UF)", // TRANSLATED USING DEEPL
  "currency-clp": "Chilean Peso", // TRANSLATED USING DEEPL
  "currency-cny": "Chinese Yuan", // TRANSLATED USING DEEPL
  "currency-cop": "Colombian Peso", // TRANSLATED USING DEEPL
  "currency-crc": "Costa Rican Colón", // TRANSLATED USING DEEPL
  "currency-cuc": "Cuban Convertible Peso", // TRANSLATED USING DEEPL
  "currency-cup": "Cuban Peso", // TRANSLATED USING DEEPL
  "currency-cve": "Cape Verdean Escudo", // TRANSLATED USING DEEPL
  "currency-czk": "Czech Republic Koruna", // TRANSLATED USING DEEPL
  "currency-djf": "Djiboutian Franc", // TRANSLATED USING DEEPL
  "currency-dkk": "Danish Krone", // TRANSLATED USING DEEPL
  "currency-dop": "Dominican Peso", // TRANSLATED USING DEEPL
  "currency-dzd": "Algerian Dinar", // TRANSLATED USING DEEPL
  "currency-egp": "Egyptian Pound", // TRANSLATED USING DEEPL
  "currency-ern": "Eritrean Nakfa", // TRANSLATED USING DEEPL
  "currency-etb": "Ethiopian Birr", // TRANSLATED USING DEEPL
  "currency-eur": "Euro", // TRANSLATED USING DEEPL
  "currency-fjd": "Fijian Dollar", // TRANSLATED USING DEEPL
  "currency-fkp": "Falkland Islands Pound", // TRANSLATED USING DEEPL
  "currency-gbp": "British Pound Sterling", // TRANSLATED USING DEEPL
  "currency-gel": "Georgian Lari", // TRANSLATED USING DEEPL
  "currency-ggp": "Guernsey Pound", // TRANSLATED USING DEEPL
  "currency-ghs": "Ghanaian Cedi", // TRANSLATED USING DEEPL
  "currency-gip": "Gibraltar Pound", // TRANSLATED USING DEEPL
  "currency-gmd": "Gambian Dalasi", // TRANSLATED USING DEEPL
  "currency-gnf": "Guinean Franc", // TRANSLATED USING DEEPL
  "currency-gtq": "Guatemalan Quetzal", // TRANSLATED USING DEEPL
  "currency-gyd": "Guyanaese Dollar", // TRANSLATED USING DEEPL
  "currency-hkd": "Hong Kong Dollar", // TRANSLATED USING DEEPL
  "currency-hnl": "Honduran Lempira", // TRANSLATED USING DEEPL
  "currency-hrk": "Croatian Kuna", // TRANSLATED USING DEEPL
  "currency-htg": "Haitian Gourde", // TRANSLATED USING DEEPL
  "currency-huf": "Hungarian Forint", // TRANSLATED USING DEEPL
  "currency-idr": "Indonesian Rupiah", // TRANSLATED USING DEEPL
  "currency-ils": "Israeli New Sheqel", // TRANSLATED USING DEEPL
  "currency-imp": "Manx pound", // TRANSLATED USING DEEPL
  "currency-inr": "Indian Rupee", // TRANSLATED USING DEEPL
  "currency-iqd": "Iraqi Dinar", // TRANSLATED USING DEEPL
  "currency-irr": "Iranian Rial", // TRANSLATED USING DEEPL
  "currency-isk": "Icelandic Króna", // TRANSLATED USING DEEPL
  "currency-jep": "Jersey Pound", // TRANSLATED USING DEEPL
  "currency-jmd": "Jamaican Dollar", // TRANSLATED USING DEEPL
  "currency-jod": "Jordanian Dinar", // TRANSLATED USING DEEPL
  "currency-jpy": "Japanese Yen", // TRANSLATED USING DEEPL
  "currency-kes": "Kenyan Shilling", // TRANSLATED USING DEEPL
  "currency-kgs": "Kyrgystani Som", // TRANSLATED USING DEEPL
  "currency-khr": "Cambodian Riel", // TRANSLATED USING DEEPL
  "currency-kmf": "Comorian Franc", // TRANSLATED USING DEEPL
  "currency-kpw": "North Korean Won", // TRANSLATED USING DEEPL
  "currency-krw": "South Korean Won", // TRANSLATED USING DEEPL
  "currency-kwd": "Kuwaiti Dinar", // TRANSLATED USING DEEPL
  "currency-kyd": "Cayman Islands Dollar", // TRANSLATED USING DEEPL
  "currency-kzt": "Kazakhstani Tenge", // TRANSLATED USING DEEPL
  "currency-lak": "Laotian Kip", // TRANSLATED USING DEEPL
  "currency-lbp": "Lebanese Pound", // TRANSLATED USING DEEPL
  "currency-lkr": "Sri Lankan Rupee", // TRANSLATED USING DEEPL
  "currency-lrd": "Liberian Dollar", // TRANSLATED USING DEEPL
  "currency-lsl": "Lesotho Loti", // TRANSLATED USING DEEPL
  "currency-lyd": "Libyan Dinar", // TRANSLATED USING DEEPL
  "currency-mad": "Moroccan Dirham", // TRANSLATED USING DEEPL
  "currency-mdl": "Moldovan Leu", // TRANSLATED USING DEEPL
  "currency-mga": "Malagasy Ariary", // TRANSLATED USING DEEPL
  "currency-mkd": "Macedonian Denar", // TRANSLATED USING DEEPL
  "currency-mmk": "Myanma Kyat", // TRANSLATED USING DEEPL
  "currency-mnt": "Mongolian Tugrik", // TRANSLATED USING DEEPL
  "currency-mop": "Macanese Pataca", // TRANSLATED USING DEEPL
  "currency-mru": "Mauritanian Ouguiya", // TRANSLATED USING DEEPL
  "currency-mur": "Mauritian Rupee", // TRANSLATED USING DEEPL
  "currency-mvr": "Maldivian Rufiyaa", // TRANSLATED USING DEEPL
  "currency-mwk": "Malawian Kwacha", // TRANSLATED USING DEEPL
  "currency-mxn": "Mexican Peso", // TRANSLATED USING DEEPL
  "currency-myr": "Malaysian Ringgit", // TRANSLATED USING DEEPL
  "currency-mzn": "Mozambican Metical", // TRANSLATED USING DEEPL
  "currency-nad": "Namibian Dollar", // TRANSLATED USING DEEPL
  "currency-ngn": "Nigerian Naira", // TRANSLATED USING DEEPL
  "currency-nio": "Nicaraguan Córdoba", // TRANSLATED USING DEEPL
  "currency-nok": "Norwegian Krone", // TRANSLATED USING DEEPL
  "currency-npr": "Nepalese Rupee", // TRANSLATED USING DEEPL
  "currency-nzd": "New Zealand Dollar", // TRANSLATED USING DEEPL
  "currency-omr": "Omani Rial", // TRANSLATED USING DEEPL
  "currency-pab": "Panamanian Balboa", // TRANSLATED USING DEEPL
  "currency-pen": "Peruvian Nuevo Sol", // TRANSLATED USING DEEPL
  "currency-pgk": "Papua New Guinean Kina", // TRANSLATED USING DEEPL
  "currency-php": "Philippine Peso", // TRANSLATED USING DEEPL
  "currency-pkr": "Pakistani Rupee", // TRANSLATED USING DEEPL
  "currency-pln": "Polish Zloty", // TRANSLATED USING DEEPL
  "currency-pyg": "Paraguayan Guarani", // TRANSLATED USING DEEPL
  "currency-qar": "Qatari Rial", // TRANSLATED USING DEEPL
  "currency-ron": "Romanian Leu", // TRANSLATED USING DEEPL
  "currency-rsd": "Serbian Dinar", // TRANSLATED USING DEEPL
  "currency-rub": "Russian Ruble", // TRANSLATED USING DEEPL
  "currency-rwf": "Rwandan Franc", // TRANSLATED USING DEEPL
  "currency-sar": "Saudi Riyal", // TRANSLATED USING DEEPL
  "currency-sbd": "Solomon Islands Dollar", // TRANSLATED USING DEEPL
  "currency-scr": "Seychellois Rupee", // TRANSLATED USING DEEPL
  "currency-sdg": "Sudanese Pound", // TRANSLATED USING DEEPL
  "currency-sek": "Swedish Krona", // TRANSLATED USING DEEPL
  "currency-sgd": "Singapore Dollar", // TRANSLATED USING DEEPL
  "currency-shp": "Saint Helena Pound", // TRANSLATED USING DEEPL
  "currency-sll": "Sierra Leonean Leone", // TRANSLATED USING DEEPL
  "currency-sos": "Somali Shilling", // TRANSLATED USING DEEPL
  "currency-srd": "Surinamese Dollar", // TRANSLATED USING DEEPL
  "currency-ssp": "South Sudanese Pound", // TRANSLATED USING DEEPL
  "currency-stn": "Sao Tomean Dobra", // TRANSLATED USING DEEPL
  "currency-svc": "Salvadoran Colón", // TRANSLATED USING DEEPL
  "currency-syp": "Syrian Pound", // TRANSLATED USING DEEPL
  "currency-szl": "Swazi Lilangeni", // TRANSLATED USING DEEPL
  "currency-thb": "Thai Baht", // TRANSLATED USING DEEPL
  "currency-tjs": "Tajikistani Somoni", // TRANSLATED USING DEEPL
  "currency-tmt": "Turkmenistani Manat", // TRANSLATED USING DEEPL
  "currency-tnd": "Tunisian Dinar", // TRANSLATED USING DEEPL
  "currency-top": "Tongan Pa'anga", // TRANSLATED USING DEEPL
  "currency-try": "Turkish Lira", // TRANSLATED USING DEEPL
  "currency-ttd": "Trinidad and Tobago Dollar", // TRANSLATED USING DEEPL
  "currency-twd": "New Taiwan Dollar", // TRANSLATED USING DEEPL
  "currency-tzs": "Tanzanian Shilling", // TRANSLATED USING DEEPL
  "currency-uah": "Ukrainian Hryvnia", // TRANSLATED USING DEEPL
  "currency-ugx": "Ugandan Shilling", // TRANSLATED USING DEEPL
  "currency-usd": "United States Dollar", // TRANSLATED USING DEEPL
  "currency-uyu": "Uruguayan Peso", // TRANSLATED USING DEEPL
  "currency-uzs": "Uzbekistan Som", // TRANSLATED USING DEEPL
  "currency-ves": "Venezuelan Bolívar", // TRANSLATED USING DEEPL
  "currency-vnd": "Vietnamese Dong", // TRANSLATED USING DEEPL
  "currency-vuv": "Vanuatu Vatu", // TRANSLATED USING DEEPL
  "currency-wst": "Samoan Tala", // TRANSLATED USING DEEPL
  "currency-xaf": "CFA Franc BEAC", // TRANSLATED USING DEEPL
  "currency-xag": "Silver Ounce", // TRANSLATED USING DEEPL
  "currency-xau": "Gold Ounce", // TRANSLATED USING DEEPL
  "currency-xcd": "East Caribbean Dollar", // TRANSLATED USING DEEPL
  "currency-xdr": "Special Drawing Rights", // TRANSLATED USING DEEPL
  "currency-xof": "CFA Franc BCEAO", // TRANSLATED USING DEEPL
  "currency-xpd": "Palladium Ounce", // TRANSLATED USING DEEPL
  "currency-xpf": "CFP Franc", // TRANSLATED USING DEEPL
  "currency-xpt": "Platinum Ounce", // TRANSLATED USING DEEPL
  "currency-yer": "Yemeni Rial", // TRANSLATED USING DEEPL
  "currency-zar": "South African Rand", // TRANSLATED USING DEEPL
  "currency-zmw": "Zambian Kwacha", // TRANSLATED USING DEEPL
  "currency-zwl": "Zimbabwean Dollar", // TRANSLATED USING DEEPL
};
