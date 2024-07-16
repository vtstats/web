// Indonesia (id)

export { default as locale } from "@angular/common/locales/id";
export { default as dateFnsLocale } from "date-fns/locale/id";

import { VSTATS_DISCORD_URL } from "src/constants/misc";
import type { translations as t } from "./messages.json";

// NOTE: SOME TRANSLATIONS ARE TRANSLATED USING DEEPL, WHICH WILL BE SIDENOTED RIGHT NEXT TO.
// SO EXPECT THE QUALITY WOULDN'T BE DECENT. IF YOU ARE CONFIDENT WITH YOUR LANGUAGE, FEEL FREE
// TO CHANGE THOSE FIELDS
export const translations: typeof t = {
  "channel-no-results": "Tidak ada hasil, coba pilih setidaknya satu VTuber", // TRANSLATED USING DEEPL
  "select-vtuber": "Pilih VTuber", // TRANSLATED USING DEEPL
  name: "Nama", // TRANSLATED USING DEEPL
  total: "Jumlah", // TRANSLATED USING DEEPL
  subscribers: "Pelanggan", // TRANSLATED USING DEEPL
  views: "Pandangan", // TRANSLATED USING DEEPL
  compare: "Membandingkan", // TRANSLATED USING DEEPL
  "last-day": "Hari Terakhir", // TRANSLATED USING DEEPL
  "last-7days": "7 Hari Terakhir", // TRANSLATED USING DEEPL
  "last-30days": "30 Hari Terakhir", // TRANSLATED USING DEEPL
  "page-not-found": "Halaman Tidak Ditemukan", // TRANSLATED USING DEEPL
  "page-not-found-desc": "Tapi Watame tidak melakukan kesalahan.", // TRANSLATED USING DEEPL
  settings: "Pengaturan", // TRANSLATED USING DEEPL
  "toggle-dark-mode": "Alihkan Mode Gelap", // TRANSLATED USING DEEPL
  general: "umum", // TRANSLATED USING DEEPL
  "average-viewers": "Rata-rata Pemirsa", // TRANSLATED USING DEEPL
  "maximum-viewers": "Pemirsa Maksimum", // TRANSLATED USING DEEPL
  "discord-channel": "Saluran Discord", // TRANSLATED USING DEEPL
  "no-stream": "Tidak ada aliran", // TRANSLATED USING DEEPL
  "stream-times": "Waktu Streaming", // TRANSLATED USING DEEPL
  "live-chat": "Obrolan Langsung", // TRANSLATED USING DEEPL
  "no-data": " TIDAK ADA DATA ", // TRANSLATED USING DEEPL
  today: "Hari ini", // TRANSLATED USING DEEPL
  yesterday: "Kemarin", // TRANSLATED USING DEEPL
  tomorrow: "Besok", // TRANSLATED USING DEEPL
  "this-week": "Minggu ini", // TRANSLATED USING DEEPL
  "this-month": "Bulan ini", // TRANSLATED USING DEEPL
  "this-year": "Tahun ini", // TRANSLATED USING DEEPL
  future: "Masa Depan", // TRANSLATED USING DEEPL
  "select-language": "Pilih Bahasa", // TRANSLATED USING DEEPL
  "stream-viewers": "Pemirsa Streaming", // TRANSLATED USING DEEPL
  "page-under-construction": "Halaman Sedang Dibangun", // TRANSLATED USING DEEPL
  "page-under-construction-desc":
    "Bagian ini sedang dalam pengembangan dan akan segera dirilis.", // TRANSLATED USING DEEPL
  revenue: "Pendapatan", // TRANSLATED USING DEEPL
  "recent-streams": "Aliran Terbaru", // TRANSLATED USING DEEPL
  "select-date": "Pilih Tanggal", // TRANSLATED USING DEEPL
  about: "Tentang", // TRANSLATED USING DEEPL
  "about-1":
    "vtstats adalah platform untuk Statistik dan Visualisasi Data VTubers.", // TRANSLATED USING DEEPL
  "about-2":
    "Ini adalah proyek sumber terbuka, Anda dapat menemukan kode sumbernya di {$START_LINK}GitHub{$CLOSE_LINK}.", // TRANSLATED USING DEEPL
  "about-3":
    "Jika Anda merasa situs web ini bermanfaat, pertimbangkan untuk mendukungnya dengan donasi dengan", // TRANSLATED USING DEEPL
  "about-4": `Bergabunglah dengan server perselisihan kami di {$START_LINK}${VSTATS_DISCORD_URL}{$CLOSE_LINK}. `,
  "about-5":
    "Kredit kepada {$START_LINK}Return YouTube Dislike{$CLOSE_LINK} untuk menyediakan data suka/tidaksuka YouTube.", // TRANSLATED USING DEEPL
  misc: "Lain-lain", // TRANSLATED USING DEEPL
  "filter-by-vtuber": "Filter berdasarkan VTuber", // TRANSLATED USING DEEPL
  clear: "Jelas", // TRANSLATED USING DEEPL
  "live-stream": "Langsung", // TRANSLATED USING DEEPL
  scheduled: "Terjadwal", // TRANSLATED USING DEEPL
  "updated-at": "Diperbarui pada {$INTERPOLATION}", // TRANSLATED USING DEEPL
  stream: "aliran", // TRANSLATED USING DEEPL
  channel: "saluran", // TRANSLATED USING DEEPL
  "super-chats": "Super Chat", // TRANSLATED USING DEEPL
  "super-sticker": "Super Stickers", // TRANSLATED USING DEEPL
  "new-member": "Anggota Baru", // TRANSLATED USING DEEPL
  "member-milestone": "Pencapaian Anggota", // TRANSLATED USING DEEPL
  cheering: "Cheering", // TRANSLATED USING DEEPL
  timed: "Waktu", // TRANSLATED USING DEEPL
  "start-time": "Waktu mulai", // TRANSLATED USING DEEPL
  "end-time": "Waktu akhir", // TRANSLATED USING DEEPL
  duration: "Durasi", // TRANSLATED USING DEEPL
  "avg-max-viewers": "Pemirsa rata-rata/maksimal", // TRANSLATED USING DEEPL
  "likes-and-dislikes": " Suka / tidak suka ", // TRANSLATED USING DEEPL
  "like-dislike-tooltip": "Disediakan oleh Return YouTube Dislike", // TRANSLATED USING DEEPL
  "revenue-tooltip-1": "Hanya termasuk", // TRANSLATED USING DEEPL
  "revenue-tooltip-youtube": "YouTube Super Chat & Super Sticker", // TRANSLATED USING DEEPL
  "revenue-tooltip-twitch": "Twitch Cheering & Hyper Chat", // TRANSLATED USING DEEPL
  member: "Anggota", // TRANSLATED USING DEEPL
  "hyper-chat": "Hyper Chat", // TRANSLATED USING DEEPL
  count: "Menghitung", // TRANSLATED USING DEEPL
  value: "Nilai", // TRANSLATED USING DEEPL
  search: "Pencarian", // TRANSLATED USING DEEPL
  "on-air": "Di Udara", // TRANSLATED USING DEEPL
  currency: "Mata uang", // TRANSLATED USING DEEPL
  "display-language": "Bahasa Tampilan", // TRANSLATED USING DEEPL
  "name-language": "Nama Bahasa", // TRANSLATED USING DEEPL
  "native-name-label": "Asli (e.g. 白上フブキ, Mori Calliope)", // TRANSLATED USING DEEPL
  "english-name-label": "Bahasa Inggris (e.g. Shirakami Fubuki, Mori Calliope)", // TRANSLATED USING DEEPL
  "japanese-name-label": "Bahasa Jepang (e.g. 白上フブキ, 森カリオペ)", // TRANSLATED USING DEEPL
  appearance: "Penampilan", // TRANSLATED USING DEEPL
  language: "Bahasa", // TRANSLATED USING DEEPL
  region: "Wilayah", // TRANSLATED USING DEEPL
  vtuber: "VTuber", // TRANSLATED USING DEEPL
  "yt-account": "Akun YouTube", // TRANSLATED USING DEEPL
  theme: "Tema", // TRANSLATED USING DEEPL
  "theme-sys-default-label": "Default sistem", // TRANSLATED USING DEEPL
  "theme-light": "Cahaya", // TRANSLATED USING DEEPL
  "theme-dark": "Gelap", // TRANSLATED USING DEEPL
  timezone: "Zona waktu", // TRANSLATED USING DEEPL
  none: "Tidak ada", // TRANSLATED USING DEEPL
  filters: "Filter", // TRANSLATED USING DEEPL
  "show-retired": "Menampilkan VTuber yang telah lulus/dihentikan", // TRANSLATED USING DEEPL
  "selected-vtuber-per-total":
    "Memilih {$INTERPOLATION} dari {$INTERPOLATION_1}\n", // TRANSLATED USING DEEPL
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
