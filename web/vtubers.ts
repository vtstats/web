type VTuber = {
  id: string;
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  discord?: string;
  facebook?: string;
  default?: boolean;
};

export type VTuberIds =
  | "amamiyayume"
  | "aoi"
  | "asa"
  | "ayamizuka"
  | "chilla"
  | "choco"
  | "fengxu"
  | "fifteen"
  | "fujinokuma"
  | "haruka"
  | "healingluka"
  | "himemiyayuka"
  | "hoonie"
  | "ikusen"
  | "kaina"
  | "kurita"
  | "kwakon"
  | "lapis"
  | "lumina"
  | "miamya"
  | "miru"
  | "nyoro"
  | "pedko"
  | "proose"
  | "queenie"
  | "rana"
  | "rayer"
  | "ruroro"
  | "sakuranoruu"
  | "sanmou"
  | "shaya"
  | "silverbell"
  | "soysaucexd"
  | "sudayoruka"
  | "tedobear"
  | "tedobear2"
  | "tsmatch"
  | "twsiriya"
  | "ubye"
  | "usagi"
  | "yumemi"
  | "yuna"
  | "zasasa";

export const vtubers: Record<VTuberIds, VTuber> = {
  amamiyayume: {
    id: "amamiyayume",
    youtube: "UClQot-XYs9KQ2fmItSz4IjA",
    twitter: "amamiyayume20",
    discord: "",
    facebook: "amamiyayume20",
    default: false,
  },
  aoi: {
    id: "aoi",
    youtube: "UCLZyaaUwBw2ZvwLt6uY3_bQ",
    twitter: "SummerAoi_0810",
    discord: "",
    facebook: "summer.aoi810",
    default: true,
  },
  asa: {
    id: "asa",
    youtube: "UCxm2qC7Z7cjDAd6yPyl-sKQ",
    twitter: "AsaIfrit",
    discord: "",
    facebook: "",
    default: true,
  },
  ayamizuka: {
    id: "ayamizuka",
    youtube: "UCYuCbE3H9xmR8_HSFizYFYg",
    twitter: "AyaMizuKaVtuber",
    discord: "cmUfWfAXBW",
    facebook: "AyaMizuKaVtuber",
    default: true,
  },
  chilla: {
    id: "chilla",
    youtube: "UCykgAuIjn70_CXLNjZ8zppQ",
    twitter: "Chilla_Storia",
    discord: "Y4fp3k2",
    facebook: "storiagame",
    default: true,
  },
  choco: {
    id: "choco",
    youtube: "UCZVkCI9NKz7q9JVW9oiTQJA",
    twitter: "ACGinspector2",
    discord: "A5aZpAQ",
    facebook: "",
    default: true,
  },
  fengxu: {
    id: "fengxu",
    youtube: "UCYPSP_gJ-BcREmsDzBIaRvw",
    twitter: "FengXu_vtb",
    discord: "",
    facebook: "FengXuVTB",
    default: true,
  },
  fifteen: {
    id: "fifteen",
    youtube: "UC_UqaRNrLcaL4fp2IAPV0OQ",
    twitter: "no15_rescute",
    discord: "",
    facebook: "RESCUTE119",
    default: true,
  },
  fujinokuma: {
    id: "fujinokuma",
    youtube: "UCmyDLzP9ZBAK2JO4kUuJMRQ",
    twitter: "fujinokuma_mama",
    discord: "",
    facebook: "",
    default: true,
  },
  haruka: {
    id: "haruka",
    youtube: "UCl1RVJbkPnpNbO9-CsDqPmQ",
    twitter: "haruka_owl",
    discord: "",
    facebook: "Harukaowl",
    default: true,
  },
  healingluka: {
    id: "healingluka",
    youtube: "UCM1nL55m_QImE0ZRqvGmWWQ",
    twitter: "Healingluka",
    discord: "",
    facebook: "HealingLuka",
    default: true,
  },
  himemiyayuka: {
    id: "himemiyayuka",
    youtube: "UC1d1dmxkh_yanq1U1gli7jw",
    twitter: "Hana_Yuukaa",
    discord: "",
    facebook: "hanayuuka.girl",
    default: true,
  },
  hoonie: {
    id: "hoonie",
    youtube: "UC6s0wLR0TZauzTVoGGw2r6g",
    twitter: "hooniefriends",
    discord: "",
    facebook: "hoonie.friends",
    default: true,
  },
  ikusen: {
    id: "ikusen",
    youtube: "UCKazkVudNQs8ZhwfXj_RNPw",
    twitter: "Ikusen_",
    discord: "",
    facebook: "ikusen.vtuber.52",
    default: true,
  },
  kaina: {
    id: "kaina",
    youtube: "UCN7sEdAjj4Q--al9pDsCPOg",
    twitter: "kaina0124",
    discord: "",
    facebook: "kaina0124",
    default: true,
  },
  kurita: {
    id: "kurita",
    youtube: "UCsvSrfDReAqYM32_VW8t09w",
    twitter: "nezumiyakurita",
    discord: "",
    facebook: "101107638560961",
    default: true,
  },
  kwakon: {
    id: "kwakon",
    youtube: "UCyZZMKRn-mUEkPzaqa9b6bg",
    twitter: "kwa_kon",
    discord: "",
    facebook: "VtuberKon",
    default: true,
  },
  lapis: {
    id: "lapis",
    youtube: "UCb_9R8SZy_HSJi53zxVh7kg",
    twitter: "ryoukenlapis",
    discord: "",
    facebook: "105752011459849",
    default: true,
  },
  lumina: {
    id: "lumina",
    youtube: "UCc5cZPorgyc23wKN-Ng1R6w",
    twitter: "lumina16569269",
    discord: "",
    facebook: "broadbandhinet",
    default: false,
  },
  miamya: {
    id: "miamya",
    youtube: "UCIR0USMXU0r7N8spBJHNA7A",
    twitter: "MiaMya0615",
    discord: "AspSwcr",
    facebook: "MiaMya0615",
    default: true,
  },
  miru: {
    id: "miru",
    youtube: "UCFahBR2wixu0xOex84bXFvg",
    twitter: "AnninMirudayo",
    discord: "",
    facebook: "AnninMirudayo",
    default: true,
  },
  nyoro: {
    id: "nyoro",
    youtube: "UC4J0GZLM55qrFh2L-ZAb2LA",
    twitter: "NyoroVanilla",
    discord: "",
    facebook: "104820211486861",
    default: true,
  },
  pedko: {
    id: "pedko",
    youtube: "UC2yG-9ekUwTs8Q0yMSycMxA",
    twitter: "Padko_tablet",
    discord: "",
    facebook: "Padko.Ch",
    default: true,
  },
  proose: {
    id: "proose",
    youtube: "UCl7ci9Pexnjf7UGpWxqj8qw",
    twitter: "purusu0325",
    discord: "",
    facebook: "106704748184668",
    default: false,
  },
  queenie: {
    id: "queenie",
    youtube: "UCtWuTDvZeZ09COJ2SjfESzQ",
    twitter: "722Queenie",
    discord: "",
    facebook: "110969990806061",
    default: true,
  },
  rana: {
    id: "rana",
    youtube: "UCFEd5V7VcxBPPcuMGpmvkQA",
    twitter: "RanaVtb",
    discord: "tobarana",
    facebook: "RanaVtb",
    default: true,
  },
  rayer: {
    id: "rayer",
    youtube: "UCDb47NT3QzoCiorDtK9C_qg",
    twitter: "ACGInspector",
    discord: "zXC2Bw5ZUs",
    facebook: "",
    default: true,
  },
  ruroro: {
    id: "ruroro",
    youtube: "UCRf7OJA3azS4RsGd_G96FUw",
    twitter: "ruroroismek",
    discord: "",
    facebook: "ruroroisme",
    default: true,
  },
  sakuranoruu: {
    id: "sakuranoruu",
    youtube: "UCgL6PS1vba90zrZW9xmiwng",
    twitter: "sakuranoruu",
    discord: "",
    facebook: "Wishswing",
    default: false,
  },
  sanmou: {
    id: "sanmou",
    youtube: "UCPqYxut8IQxG4HAMrJx5ffQ",
    twitter: "3MouDolp",
    discord: "",
    facebook: "",
    default: true,
  },
  shaya: {
    id: "shaya",
    youtube: "UCU8O__T_J93Cnoi6HoRoPow",
    twitter: "About_Shaya",
    discord: "3YeKzZB",
    facebook: "Shaya-100558584706248",
    default: false,
  },
  silverbell: {
    id: "silverbell",
    youtube: "UCwO7OC8he-XAkrDNvGe5kXA",
    twitter: "SilverBellVtub1",
    discord: "",
    facebook: "SilverBell.lVtuber",
    default: false,
  },
  soysaucexd: {
    id: "soysaucexd",
    youtube: "UCy5l7iZCTy-alDJ9rL5kuXQ",
    twitter: "SoysauceXD",
    discord: "",
    facebook: "",
    default: false,
  },
  sudayoruka: {
    id: "sudayoruka",
    youtube: "UCuy-kZJ7HWwUU-eKv0zUZFQ",
    twitter: "sudayoruka",
    discord: "p6CRD63Mzc",
    facebook: "sudayoruka",
    default: true,
  },
  tedobear: {
    id: "tedobear",
    youtube: "UCqy310kNTAokme7plaXTwQw",
    twitter: "VirtualTedobear",
    discord: "",
    facebook: "",
    default: false,
  },
  tedobear2: {
    id: "tedobear2",
    youtube: "UCzHbCUKXn65icryUIgn1ETA",
    twitter: "VirtualTedobear",
    discord: "",
    facebook: "",
    default: true,
  },
  tsmatch: {
    id: "tsmatch",
    youtube: "UCXzEDlhV7wJuMY4c-Fvz7uQ",
    twitter: "Tsmatch_T96",
    discord: "",
    facebook: "",
    default: true,
  },
  twsiriya: {
    id: "twsiriya",
    youtube: "UCOpI60ey2pDJnmV2T351AOg",
    twitter: "twsiriya",
    discord: "",
    facebook: "105037511566512",
    default: false,
  },
  ubye: {
    id: "ubye",
    youtube: "UC-o-1qjKkMLq-ZFxXIzOUBQ",
    twitter: "UbyeCloud",
    discord: "",
    facebook: "Ubyecloud",
    default: true,
  },
  usagi: {
    id: "usagi",
    youtube: "UC0u_-3zgLkSYpQOxlBi-5Ng",
    twitter: "kuroxusagihime",
    discord: "",
    facebook: "usagihime777",
    default: true,
  },
  yumemi: {
    id: "yumemi",
    youtube: "UCRUFY2ZCyVOvC-1rJIVZlKg",
    twitter: "Kumonoue_Yumemi",
    discord: "",
    facebook: "",
    default: true,
  },
  yuna: {
    id: "yuna",
    youtube: "UCjj4xu_HzcrOr9Jsltw0gCQ",
    twitter: "Mizunoyuna1",
    discord: "",
    facebook: "Mizunoyuna321",
    default: true,
  },
  zasasa: {
    id: "zasasa",
    youtube: "UCaN_Pq3x9pzhb7t9KhxQm8Q",
    twitter: "spicy_zasasa",
    discord: "",
    facebook: "110969990806061",
    default: true,
  },
};

export type BatchIds =
  | "STORIA"
  | "acclaim"
  | "acg"
  | "amamiyayume"
  | "aoi"
  | "asa"
  | "ayamizuka"
  | "blossomlive"
  | "changing"
  | "cyberlive"
  | "fengxu"
  | "fourvirtual"
  | "fujinokuma"
  | "haruka"
  | "healingluka"
  | "hinet"
  | "kaina"
  | "kolhunter"
  | "kurita"
  | "kwakon"
  | "lapis"
  | "miru"
  | "moegenki"
  | "proose"
  | "queenie722"
  | "renewlive"
  | "shaya"
  | "silverbell"
  | "soysaucexd"
  | "tsmatch"
  | "twsiriya"
  | "ubye"
  | "usagi"
  | "yahoo"
  | "yenz"
  | "yumemi";

type Batch = VTuberIds[];

export const batches: Record<BatchIds, Batch> = {
  "STORIA": ["chilla"],
  "acclaim": ["ikusen"],
  "acg": ["choco", "rayer"],
  "amamiyayume": null,
  "aoi": null,
  "asa": null,
  "ayamizuka": null,
  "blossomlive": ["sakuranoruu"],
  "changing": ["fifteen", "pedko"],
  "cyberlive": ["nyoro", "yuna"],
  "fengxu": null,
  "fourvirtual": ["sanmou", "tedobear", "tedobear2"],
  "fujinokuma": null,
  "haruka": null,
  "healingluka": null,
  "hinet": ["lumina"],
  "kaina": null,
  "kolhunter": ["ruroro"],
  "kurita": null,
  "kwakon": null,
  "lapis": null,
  "miru": null,
  "moegenki": ["himemiyayuka", "miamya"],
  "proose": null,
  "queenie722": ["queenie", "zasasa"],
  "renewlive": ["sudayoruka"],
  "shaya": null,
  "silverbell": null,
  "soysaucexd": null,
  "tsmatch": null,
  "twsiriya": null,
  "ubye": null,
  "usagi": null,
  "yahoo": ["hoonie"],
  "yenz": ["rana"],
  "yumemi": null,
};