// Filipino (fil)

export { default as locale } from "@angular/common/locales/fil";
export { default as dateFnsLocale } from "date-fns/locale/en-US";

import { VSTATS_DISCORD_URL } from "src/constants/misc";
import type { translations as t } from "./messages.json";

// NOTE: SOME TRANSLATIONS ARE TRANSLATED USING DEEPL, WHICH WILL BE SIDENOTED RIGHT NEXT TO.
// SO EXPECT THE QUALITY WOULDN'T BE DECENT. IF YOU ARE CONFIDENT WITH YOUR LANGUAGE, FEEL FREE
// TO CHANGE THOSE FIELDS
export const translations: typeof t = {
  "channel-no-results":
    "Walang mga resulta, subukang pumili ng kahit isang VTuber", // TRANSLATED USING GOOGLE TRANSLATE
  "select-vtuber": "Piliin ang VTuber", // TRANSLATED USING GOOGLE TRANSLATE
  name: "Pangalan", // TRANSLATED USING GOOGLE TRANSLATE
  total: "Total", // TRANSLATED USING GOOGLE TRANSLATE
  subscribers: "Mga subscriber", // TRANSLATED USING GOOGLE TRANSLATE
  views: "Mga view", // TRANSLATED USING GOOGLE TRANSLATE
  compare: "Ihambing", // TRANSLATED USING GOOGLE TRANSLATE
  "last-day": "Huling araw", // TRANSLATED USING GOOGLE TRANSLATE
  "last-7days": "Huling 7 araw", // TRANSLATED USING GOOGLE TRANSLATE
  "last-30days": "huling 30 araw", // TRANSLATED USING GOOGLE TRANSLATE
  "page-not-found": "Hindi nahanap ang pahina", // TRANSLATED USING GOOGLE TRANSLATE
  "page-not-found-desc": "Pero walang ginawang masama si watame.", // TRANSLATED USING GOOGLE TRANSLATE
  settings: "Mga setting", // TRANSLATED USING GOOGLE TRANSLATE
  "toggle-dark-mode": "I-toggle ang Dark Mode", // TRANSLATED USING GOOGLE TRANSLATE
  general: "pangkalahatan", // TRANSLATED USING GOOGLE TRANSLATE
  "average-viewers": "Average na mga manonood", // TRANSLATED USING GOOGLE TRANSLATE
  "maximum-viewers": "Maximum na mga manonood", // TRANSLATED USING GOOGLE TRANSLATE
  "discord-channel": "Discord Channel", // TRANSLATED USING GOOGLE TRANSLATE
  "no-stream": "Walang stream", // TRANSLATED USING GOOGLE TRANSLATE
  "stream-times": "Mga oras ng stream", // TRANSLATED USING GOOGLE TRANSLATE
  "live-chat": "Live Chat", // TRANSLATED USING GOOGLE TRANSLATE
  "no-data": " WALANG DATA ", // TRANSLATED USING GOOGLE TRANSLATE
  today: "Ngayong araw", // TRANSLATED USING GOOGLE TRANSLATE
  yesterday: "Kahapon", // TRANSLATED USING GOOGLE TRANSLATE
  tomorrow: "Bukas", // TRANSLATED USING GOOGLE TRANSLATE
  "this-week": "Ngayong linggo", // TRANSLATED USING GOOGLE TRANSLATE
  "this-month": "Sa buwang ito", // TRANSLATED USING GOOGLE TRANSLATE
  "this-year": "Ngayong taon", // TRANSLATED USING GOOGLE TRANSLATE
  future: "Kinabukasan", // TRANSLATED USING GOOGLE TRANSLATE
  "select-language": "Piliin ang Wika", // TRANSLATED USING GOOGLE TRANSLATE
  "stream-viewers": "Stream Viewers", // TRANSLATED USING GOOGLE TRANSLATE
  "page-under-construction": "Isinasagawa ang Pahina", // TRANSLATED USING GOOGLE TRANSLATE
  "page-under-construction-desc":
    "Ang seksyong ito ay kasalukuyang nasa ilalim ng pagbuo at malapit nang ilabas.", // TRANSLATED USING GOOGLE TRANSLATE
  revenue: "Kita", // TRANSLATED USING GOOGLE TRANSLATE
  "recent-streams": "Kamakailang mga stream", // TRANSLATED USING GOOGLE TRANSLATE
  "select-date": "Piliin ang petsa", // TRANSLATED USING GOOGLE TRANSLATE
  about: "Tungkol sa", // TRANSLATED USING GOOGLE TRANSLATE
  "about-1":
    "Ang vtstats ay isang platform para sa VTubers Statistics at Data Visualization.", // TRANSLATED USING GOOGLE TRANSLATE
  "about-2":
    "Isa itong open source na proyekto, mahahanap mo ang source code sa {$START_LINK}GitHub{$CLOSE_LINK}.", // TRANSLATED USING GOOGLE TRANSLATE
  "about-3":
    "Kung sa tingin mo ay kapaki-pakinabang ang website na ito, isaalang-alang ang pagsuporta dito sa pamamagitan ng donasyon ni", // TRANSLATED USING GOOGLE TRANSLATE
  "about-4": `Sumali sa aming discord server sa {$START_LINK}${VSTATS_DISCORD_URL}{$CLOSE_LINK}.`,
  "about-5":
    "Mga kredito sa {$START_LINK}Return YouTube Dislike{$CLOSE_LINK} para sa pagbibigay ng youtube like/dislike data.", // TRANSLATED USING GOOGLE TRANSLATE
  misc: "Miscellaneous", // TRANSLATED USING GOOGLE TRANSLATE
  "filter-by-vtuber": "I-filter ayon sa VTuber", // TRANSLATED USING GOOGLE TRANSLATE
  clear: "Magliwanag", // TRANSLATED USING GOOGLE TRANSLATE
  "live-stream": "Live", // TRANSLATED USING GOOGLE TRANSLATE
  scheduled: "Nakaiskedyul", // TRANSLATED USING GOOGLE TRANSLATE
  "updated-at": "Na-update sa {$INTERPOLATION}", // TRANSLATED USING GOOGLE TRANSLATE
  stream: "stream", // TRANSLATED USING GOOGLE TRANSLATE
  channel: "channel", // TRANSLATED USING GOOGLE TRANSLATE
  "super-chats": "Super Chat", // TRANSLATED USING GOOGLE TRANSLATE
  "super-sticker": "Super Stickers", // TRANSLATED USING GOOGLE TRANSLATE
  "new-member": "Bagong Miyembro", // TRANSLATED USING GOOGLE TRANSLATE
  "member-milestone": "Miyembro Milestone", // TRANSLATED USING GOOGLE TRANSLATE
  cheering: "Cheering", // TRANSLATED USING GOOGLE TRANSLATE
  timed: "Nag-time", // TRANSLATED USING GOOGLE TRANSLATE
  "start-time": "Oras ng simula", // TRANSLATED USING GOOGLE TRANSLATE
  "end-time": "Oras ng pagtatapos", // TRANSLATED USING GOOGLE TRANSLATE
  duration: "Tagal", // TRANSLATED USING GOOGLE TRANSLATE
  "avg-max-viewers": "Avg./max na mga manonood", // TRANSLATED USING GOOGLE TRANSLATE
  "likes-and-dislikes": " Gusto / ayaw ", // TRANSLATED USING GOOGLE TRANSLATE
  "like-dislike-tooltip": "Ibinigay ng Return YouTube Dislike", // TRANSLATED USING GOOGLE TRANSLATE
  "revenue-tooltip-1": "Kasama lang", // TRANSLATED USING GOOGLE TRANSLATE
  "revenue-tooltip-youtube": "YouTube Super Chat at Super Sticker", // TRANSLATED USING GOOGLE TRANSLATE
  "revenue-tooltip-twitch": "Twitch Cheering at Hyper Chat", // TRANSLATED USING GOOGLE TRANSLATE
  member: "Miyembro", // TRANSLATED USING GOOGLE TRANSLATE
  "hyper-chat": "Hyper Chat", // TRANSLATED USING GOOGLE TRANSLATE
  count: "Bilang", // TRANSLATED USING GOOGLE TRANSLATE
  value: "Halaga", // TRANSLATED USING GOOGLE TRANSLATE
  search: "Maghanap", // TRANSLATED USING GOOGLE TRANSLATE
  "on-air": "On Air", // TRANSLATED USING GOOGLE TRANSLATE
  currency: "Pera", // TRANSLATED USING GOOGLE TRANSLATE
  "display-language": "Display Language", // TRANSLATED USING GOOGLE TRANSLATE
  "name-language": "Pangalan ng Wika", // TRANSLATED USING GOOGLE TRANSLATE
  "native-name-label": "Katutubo (e.g. 白上フブキ, Mori Calliope)", // TRANSLATED USING GOOGLE TRANSLATE
  "english-name-label": "Ingles (e.g. Shirakami Fubuki, Mori Calliope)", // TRANSLATED USING GOOGLE TRANSLATE
  "japanese-name-label": "Hapon (e.g. 白上フブキ, 森カリオペ)", // TRANSLATED USING GOOGLE TRANSLATE
  appearance: "Hitsura", // TRANSLATED USING GOOGLE TRANSLATE
  language: "Wika", // TRANSLATED USING GOOGLE TRANSLATE
  region: "Rehiyon", // TRANSLATED USING GOOGLE TRANSLATE
  vtuber: "VTuber", // TRANSLATED USING GOOGLE TRANSLATE
  "yt-account": "YouTube Account", // TRANSLATED USING GOOGLE TRANSLATE
  theme: "Tema", // TRANSLATED USING GOOGLE TRANSLATE
  "theme-sys-default-label": "Default ng system", // TRANSLATED USING GOOGLE TRANSLATE
  "theme-light": "Liwanag", // TRANSLATED USING GOOGLE TRANSLATE
  "theme-dark": "Madilim", // TRANSLATED USING GOOGLE TRANSLATE
  timezone: "Timezone", // TRANSLATED USING GOOGLE TRANSLATE
  none: "Wala", // TRANSLATED USING GOOGLE TRANSLATE
  filters: "Mga filter", // TRANSLATED USING GOOGLE TRANSLATE
  "show-retired": "Ipakita ang mga nagtapos/tinapos na VTubers", // TRANSLATED USING GOOGLE TRANSLATE
  "selected-vtuber-per-total":
    "Pinili ang {$INTERPOLATION} sa {$INTERPOLATION_1}\n", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-aed": "United Arab Emirates Dirham", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-afn": "Afghan Afghani", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-all": "Albanian Lek", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-amd": "Armenian Dram", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ang": "Netherlands Antillean Guilder", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-aoa": "Angolan Kwanza", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ars": "Argentine Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-aud": "Australian Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-awg": "Aruban Florin", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-azn": "Azerbaijani Manat", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bam": "Bosnia-Herzegovina Convertible Mark", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bbd": "Barbadian Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bdt": "Bangladeshi Taka", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bgn": "Bulgarian Lev", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bhd": "Bahraini Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bif": "Burundian Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bmd": "Bermudan Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bnd": "Brunei Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bob": "Bolivian Boliviano", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-brl": "Brazilian Real", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bsd": "Bahamian Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-btc": "Bitcoin", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-btn": "Bhutanese Ngultrum", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bwp": "Botswanan Pula", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-byn": "Belarusian Ruble", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-bzd": "Belize Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-cad": "Canadian Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-cdf": "Congolese Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-chf": "Swiss Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-clf": "Chilean Unit of Account (UF)", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-clp": "Chilean Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-cny": "Chinese Yuan", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-cop": "Colombian Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-crc": "Costa Rican Colón", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-cuc": "Cuban Convertible Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-cup": "Cuban Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-cve": "Cape Verdean Escudo", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-czk": "Czech Republic Koruna", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-djf": "Djiboutian Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-dkk": "Danish Krone", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-dop": "Dominican Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-dzd": "Algerian Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-egp": "Egyptian Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ern": "Eritrean Nakfa", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-etb": "Ethiopian Birr", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-eur": "Euro", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-fjd": "Fijian Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-fkp": "Falkland Islands Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-gbp": "British Pound Sterling", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-gel": "Georgian Lari", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ggp": "Guernsey Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ghs": "Ghanaian Cedi", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-gip": "Gibraltar Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-gmd": "Gambian Dalasi", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-gnf": "Guinean Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-gtq": "Guatemalan Quetzal", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-gyd": "Guyanaese Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-hkd": "Hong Kong Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-hnl": "Honduran Lempira", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-hrk": "Croatian Kuna", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-htg": "Haitian Gourde", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-huf": "Hungarian Forint", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-idr": "Indonesian Rupiah", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ils": "Israeli New Sheqel", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-imp": "Manx pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-inr": "Indian Rupee", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-iqd": "Iraqi Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-irr": "Iranian Rial", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-isk": "Icelandic Króna", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-jep": "Jersey Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-jmd": "Jamaican Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-jod": "Jordanian Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-jpy": "Japanese Yen", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-kes": "Kenyan Shilling", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-kgs": "Kyrgystani Som", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-khr": "Cambodian Riel", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-kmf": "Comorian Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-kpw": "North Korean Won", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-krw": "South Korean Won", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-kwd": "Kuwaiti Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-kyd": "Cayman Islands Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-kzt": "Kazakhstani Tenge", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-lak": "Laotian Kip", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-lbp": "Lebanese Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-lkr": "Sri Lankan Rupee", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-lrd": "Liberian Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-lsl": "Lesotho Loti", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-lyd": "Libyan Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mad": "Moroccan Dirham", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mdl": "Moldovan Leu", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mga": "Malagasy Ariary", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mkd": "Macedonian Denar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mmk": "Myanma Kyat", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mnt": "Mongolian Tugrik", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mop": "Macanese Pataca", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mru": "Mauritanian Ouguiya", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mur": "Mauritian Rupee", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mvr": "Maldivian Rufiyaa", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mwk": "Malawian Kwacha", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mxn": "Mexican Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-myr": "Malaysian Ringgit", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-mzn": "Mozambican Metical", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-nad": "Namibian Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ngn": "Nigerian Naira", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-nio": "Nicaraguan Córdoba", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-nok": "Norwegian Krone", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-npr": "Nepalese Rupee", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-nzd": "New Zealand Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-omr": "Omani Rial", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-pab": "Panamanian Balboa", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-pen": "Peruvian Nuevo Sol", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-pgk": "Papua New Guinean Kina", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-php": "Philippine Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-pkr": "Pakistani Rupee", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-pln": "Polish Zloty", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-pyg": "Paraguayan Guarani", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-qar": "Qatari Rial", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ron": "Romanian Leu", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-rsd": "Serbian Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-rub": "Russian Ruble", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-rwf": "Rwandan Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-sar": "Saudi Riyal", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-sbd": "Solomon Islands Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-scr": "Seychellois Rupee", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-sdg": "Sudanese Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-sek": "Swedish Krona", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-sgd": "Singapore Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-shp": "Saint Helena Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-sll": "Sierra Leonean Leone", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-sos": "Somali Shilling", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-srd": "Surinamese Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ssp": "South Sudanese Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-stn": "Sao Tomean Dobra", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-svc": "Salvadoran Colón", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-syp": "Syrian Pound", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-szl": "Swazi Lilangeni", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-thb": "Thai Baht", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-tjs": "Tajikistani Somoni", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-tmt": "Turkmenistani Manat", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-tnd": "Tunisian Dinar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-top": "Tongan Pa'anga", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-try": "Turkish Lira", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ttd": "Trinidad and Tobago Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-twd": "New Taiwan Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-tzs": "Tanzanian Shilling", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-uah": "Ukrainian Hryvnia", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ugx": "Ugandan Shilling", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-usd": "United States Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-uyu": "Uruguayan Peso", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-uzs": "Uzbekistan Som", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-ves": "Venezuelan Bolívar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-vnd": "Vietnamese Dong", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-vuv": "Vanuatu Vatu", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-wst": "Samoan Tala", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xaf": "CFA Franc BEAC", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xag": "Silver Ounce", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xau": "Gold Ounce", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xcd": "East Caribbean Dollar", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xdr": "Special Drawing Rights", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xof": "CFA Franc BCEAO", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xpd": "Palladium Ounce", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xpf": "CFP Franc", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-xpt": "Platinum Ounce", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-yer": "Yemeni Rial", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-zar": "South African Rand", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-zmw": "Zambian Kwacha", // TRANSLATED USING GOOGLE TRANSLATE
  "currency-zwl": "Zimbabwean Dollar", // TRANSLATED USING GOOGLE TRANSLATE
};
