import { InjectionToken } from "@angular/core";
import { QueryClient } from "@tanstack/query-core";
import { Locale } from "date-fns";
import { Channel, Group, VTuber } from "../models";

export const QUERY_CLIENT = new InjectionToken<QueryClient>("QUERY_CLIENT");

export const DATE_FNS_LOCALE = new InjectionToken<Locale>("DATE_FNS_LOCALE");

export const EXCHANGE_RATES = new InjectionToken<Record<string, number>>(
  "EXCHANGE_RATES"
);

export const CATALOG_VTUBERS = new InjectionToken<VTuber[]>("CATALOG_VTUBERS");

export const CATALOG_CHANNELS = new InjectionToken<Channel[]>(
  "CATALOG_CHANNELS"
);

export const CATALOG_GROUPS = new InjectionToken<Group[]>("CATALOG_GROUPS");

export const CHAT_CURRENCIES = new InjectionToken<string[][]>(
  "CHAT_CURRENCIES",
  {
    // https://api.exchangerate.host/symbols
    factory: () => [
      ["AED", $localize`:@@currency-aed:United Arab Emirates Dirham`],
      ["AFN", $localize`:@@currency-afn:Afghan Afghani`],
      ["ALL", $localize`:@@currency-all:Albanian Lek`],
      ["AMD", $localize`:@@currency-amd:Armenian Dram`],
      ["ANG", $localize`:@@currency-ang:Netherlands Antillean Guilder`],
      ["AOA", $localize`:@@currency-aoa:Angolan Kwanza`],
      ["ARS", $localize`:@@currency-ars:Argentine Peso`],
      ["AUD", $localize`:@@currency-aud:Australian Dollar`],
      ["AWG", $localize`:@@currency-awg:Aruban Florin`],
      ["AZN", $localize`:@@currency-azn:Azerbaijani Manat`],
      ["BAM", $localize`:@@currency-bam:Bosnia-Herzegovina Convertible Mark`],
      ["BBD", $localize`:@@currency-bbd:Barbadian Dollar`],
      ["BDT", $localize`:@@currency-bdt:Bangladeshi Taka`],
      ["BGN", $localize`:@@currency-bgn:Bulgarian Lev`],
      ["BHD", $localize`:@@currency-bhd:Bahraini Dinar`],
      ["BIF", $localize`:@@currency-bif:Burundian Franc`],
      ["BMD", $localize`:@@currency-bmd:Bermudan Dollar`],
      ["BND", $localize`:@@currency-bnd:Brunei Dollar`],
      ["BOB", $localize`:@@currency-bob:Bolivian Boliviano`],
      ["BRL", $localize`:@@currency-brl:Brazilian Real`],
      ["BSD", $localize`:@@currency-bsd:Bahamian Dollar`],
      ["BTC", $localize`:@@currency-btc:Bitcoin`],
      ["BTN", $localize`:@@currency-btn:Bhutanese Ngultrum`],
      ["BWP", $localize`:@@currency-bwp:Botswanan Pula`],
      ["BYN", $localize`:@@currency-byn:Belarusian Ruble`],
      ["BZD", $localize`:@@currency-bzd:Belize Dollar`],
      ["CAD", $localize`:@@currency-cad:Canadian Dollar`],
      ["CDF", $localize`:@@currency-cdf:Congolese Franc`],
      ["CHF", $localize`:@@currency-chf:Swiss Franc`],
      ["CLF", $localize`:@@currency-clf:Chilean Unit of Account (UF)`],
      ["CLP", $localize`:@@currency-clp:Chilean Peso`],
      ["CNY", $localize`:@@currency-cny:Chinese Yuan`],
      ["COP", $localize`:@@currency-cop:Colombian Peso`],
      ["CRC", $localize`:@@currency-crc:Costa Rican Col\u00F3n`],
      ["CUC", $localize`:@@currency-cuc:Cuban Convertible Peso`],
      ["CUP", $localize`:@@currency-cup:Cuban Peso`],
      ["CVE", $localize`:@@currency-cve:Cape Verdean Escudo`],
      ["CZK", $localize`:@@currency-czk:Czech Republic Koruna`],
      ["DJF", $localize`:@@currency-djf:Djiboutian Franc`],
      ["DKK", $localize`:@@currency-dkk:Danish Krone`],
      ["DOP", $localize`:@@currency-dop:Dominican Peso`],
      ["DZD", $localize`:@@currency-dzd:Algerian Dinar`],
      ["EGP", $localize`:@@currency-egp:Egyptian Pound`],
      ["ERN", $localize`:@@currency-ern:Eritrean Nakfa`],
      ["ETB", $localize`:@@currency-etb:Ethiopian Birr`],
      ["EUR", $localize`:@@currency-eur:Euro`],
      ["FJD", $localize`:@@currency-fjd:Fijian Dollar`],
      ["FKP", $localize`:@@currency-fkp:Falkland Islands Pound`],
      ["GBP", $localize`:@@currency-gbp:British Pound Sterling`],
      ["GEL", $localize`:@@currency-gel:Georgian Lari`],
      ["GGP", $localize`:@@currency-ggp:Guernsey Pound`],
      ["GHS", $localize`:@@currency-ghs:Ghanaian Cedi`],
      ["GIP", $localize`:@@currency-gip:Gibraltar Pound`],
      ["GMD", $localize`:@@currency-gmd:Gambian Dalasi`],
      ["GNF", $localize`:@@currency-gnf:Guinean Franc`],
      ["GTQ", $localize`:@@currency-gtq:Guatemalan Quetzal`],
      ["GYD", $localize`:@@currency-gyd:Guyanaese Dollar`],
      ["HKD", $localize`:@@currency-hkd:Hong Kong Dollar`],
      ["HNL", $localize`:@@currency-hnl:Honduran Lempira`],
      ["HRK", $localize`:@@currency-hrk:Croatian Kuna`],
      ["HTG", $localize`:@@currency-htg:Haitian Gourde`],
      ["HUF", $localize`:@@currency-huf:Hungarian Forint`],
      ["IDR", $localize`:@@currency-idr:Indonesian Rupiah`],
      ["ILS", $localize`:@@currency-ils:Israeli New Sheqel`],
      ["IMP", $localize`:@@currency-imp:Manx pound`],
      ["INR", $localize`:@@currency-inr:Indian Rupee`],
      ["IQD", $localize`:@@currency-iqd:Iraqi Dinar`],
      ["IRR", $localize`:@@currency-irr:Iranian Rial`],
      ["ISK", $localize`:@@currency-isk:Icelandic Króna`],
      ["JEP", $localize`:@@currency-jep:Jersey Pound`],
      ["JMD", $localize`:@@currency-jmd:Jamaican Dollar`],
      ["JOD", $localize`:@@currency-jod:Jordanian Dinar`],
      ["JPY", $localize`:@@currency-jpy:Japanese Yen`],
      ["KES", $localize`:@@currency-kes:Kenyan Shilling`],
      ["KGS", $localize`:@@currency-kgs:Kyrgystani Som`],
      ["KHR", $localize`:@@currency-khr:Cambodian Riel`],
      ["KMF", $localize`:@@currency-kmf:Comorian Franc`],
      ["KPW", $localize`:@@currency-kpw:North Korean Won`],
      ["KRW", $localize`:@@currency-krw:South Korean Won`],
      ["KWD", $localize`:@@currency-kwd:Kuwaiti Dinar`],
      ["KYD", $localize`:@@currency-kyd:Cayman Islands Dollar`],
      ["KZT", $localize`:@@currency-kzt:Kazakhstani Tenge`],
      ["LAK", $localize`:@@currency-lak:Laotian Kip`],
      ["LBP", $localize`:@@currency-lbp:Lebanese Pound`],
      ["LKR", $localize`:@@currency-lkr:Sri Lankan Rupee`],
      ["LRD", $localize`:@@currency-lrd:Liberian Dollar`],
      ["LSL", $localize`:@@currency-lsl:Lesotho Loti`],
      ["LYD", $localize`:@@currency-lyd:Libyan Dinar`],
      ["MAD", $localize`:@@currency-mad:Moroccan Dirham`],
      ["MDL", $localize`:@@currency-mdl:Moldovan Leu`],
      ["MGA", $localize`:@@currency-mga:Malagasy Ariary`],
      ["MKD", $localize`:@@currency-mkd:Macedonian Denar`],
      ["MMK", $localize`:@@currency-mmk:Myanma Kyat`],
      ["MNT", $localize`:@@currency-mnt:Mongolian Tugrik`],
      ["MOP", $localize`:@@currency-mop:Macanese Pataca`],
      ["MRU", $localize`:@@currency-mru:Mauritanian Ouguiya`],
      ["MUR", $localize`:@@currency-mur:Mauritian Rupee`],
      ["MVR", $localize`:@@currency-mvr:Maldivian Rufiyaa`],
      ["MWK", $localize`:@@currency-mwk:Malawian Kwacha`],
      ["MXN", $localize`:@@currency-mxn:Mexican Peso`],
      ["MYR", $localize`:@@currency-myr:Malaysian Ringgit`],
      ["MZN", $localize`:@@currency-mzn:Mozambican Metical`],
      ["NAD", $localize`:@@currency-nad:Namibian Dollar`],
      ["NGN", $localize`:@@currency-ngn:Nigerian Naira`],
      ["NIO", $localize`:@@currency-nio:Nicaraguan Córdoba`],
      ["NOK", $localize`:@@currency-nok:Norwegian Krone`],
      ["NPR", $localize`:@@currency-npr:Nepalese Rupee`],
      ["NZD", $localize`:@@currency-nzd:New Zealand Dollar`],
      ["OMR", $localize`:@@currency-omr:Omani Rial`],
      ["PAB", $localize`:@@currency-pab:Panamanian Balboa`],
      ["PEN", $localize`:@@currency-pen:Peruvian Nuevo Sol`],
      ["PGK", $localize`:@@currency-pgk:Papua New Guinean Kina`],
      ["PHP", $localize`:@@currency-php:Philippine Peso`],
      ["PKR", $localize`:@@currency-pkr:Pakistani Rupee`],
      ["PLN", $localize`:@@currency-pln:Polish Zloty`],
      ["PYG", $localize`:@@currency-pyg:Paraguayan Guarani`],
      ["QAR", $localize`:@@currency-qar:Qatari Rial`],
      ["RON", $localize`:@@currency-ron:Romanian Leu`],
      ["RSD", $localize`:@@currency-rsd:Serbian Dinar`],
      ["RUB", $localize`:@@currency-rub:Russian Ruble`],
      ["RWF", $localize`:@@currency-rwf:Rwandan Franc`],
      ["SAR", $localize`:@@currency-sar:Saudi Riyal`],
      ["SBD", $localize`:@@currency-sbd:Solomon Islands Dollar`],
      ["SCR", $localize`:@@currency-scr:Seychellois Rupee`],
      ["SDG", $localize`:@@currency-sdg:Sudanese Pound`],
      ["SEK", $localize`:@@currency-sek:Swedish Krona`],
      ["SGD", $localize`:@@currency-sgd:Singapore Dollar`],
      ["SHP", $localize`:@@currency-shp:Saint Helena Pound`],
      ["SLL", $localize`:@@currency-sll:Sierra Leonean Leone`],
      ["SOS", $localize`:@@currency-sos:Somali Shilling`],
      ["SRD", $localize`:@@currency-srd:Surinamese Dollar`],
      ["SSP", $localize`:@@currency-ssp:South Sudanese Pound`],
      ["STN", $localize`:@@currency-stn:Sao Tomean Dobra`],
      ["SVC", $localize`:@@currency-svc:Salvadoran Colón`],
      ["SYP", $localize`:@@currency-syp:Syrian Pound`],
      ["SZL", $localize`:@@currency-szl:Swazi Lilangeni`],
      ["THB", $localize`:@@currency-thb:Thai Baht`],
      ["TJS", $localize`:@@currency-tjs:Tajikistani Somoni`],
      ["TMT", $localize`:@@currency-tmt:Turkmenistani Manat`],
      ["TND", $localize`:@@currency-tnd:Tunisian Dinar`],
      ["TOP", $localize`:@@currency-top:Tongan Pa'anga`],
      ["TRY", $localize`:@@currency-try:Turkish Lira`],
      ["TTD", $localize`:@@currency-ttd:Trinidad and Tobago Dollar`],
      ["TWD", $localize`:@@currency-twd:New Taiwan Dollar`],
      ["TZS", $localize`:@@currency-tzs:Tanzanian Shilling`],
      ["UAH", $localize`:@@currency-uah:Ukrainian Hryvnia`],
      ["UGX", $localize`:@@currency-ugx:Ugandan Shilling`],
      ["USD", $localize`:@@currency-usd:United States Dollar`, "US$"],
      ["UYU", $localize`:@@currency-uyu:Uruguayan Peso`],
      ["UZS", $localize`:@@currency-uzs:Uzbekistan Som`],
      ["VES", $localize`:@@currency-ves:Venezuelan Bolívar`],
      ["VND", $localize`:@@currency-vnd:Vietnamese Dong`],
      ["VUV", $localize`:@@currency-vuv:Vanuatu Vatu`],
      ["WST", $localize`:@@currency-wst:Samoan Tala`],
      ["XAF", $localize`:@@currency-xaf:CFA Franc BEAC`],
      ["XAG", $localize`:@@currency-xag:Silver Ounce`],
      ["XAU", $localize`:@@currency-xau:Gold Ounce`],
      ["XCD", $localize`:@@currency-xcd:East Caribbean Dollar`],
      ["XDR", $localize`:@@currency-xdr:Special Drawing Rights`],
      ["XOF", $localize`:@@currency-xof:CFA Franc BCEAO`],
      ["XPD", $localize`:@@currency-xpd:Palladium Ounce`],
      ["XPF", $localize`:@@currency-xpf:CFP Franc`],
      ["XPT", $localize`:@@currency-xpt:Platinum Ounce`],
      ["YER", $localize`:@@currency-yer:Yemeni Rial`],
      ["ZAR", $localize`:@@currency-zar:South African Rand`],
      ["ZMW", $localize`:@@currency-zmw:Zambian Kwacha`],
      ["ZWL", $localize`:@@currency-zwl:Zimbabwean Dollar`],
    ],
  }
);