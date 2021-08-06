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
  | "ahiruibi"
  | "amamiyayume"
  | "aoi"
  | "asa"
  | "ayamizuka"
  | "balaenmlnam"
  | "beryllulu"
  | "chilla"
  | "choco"
  | "fengxu"
  | "fifteen"
  | "fujinokuma"
  | "gentotaitan"
  | "haruka"
  | "healingluka"
  | "himemiyayuka"
  | "hoonie"
  | "ikusen"
  | "jimu0918"
  | "kaina"
  | "kurita"
  | "kwakon"
  | "lapis"
  | "lumina"
  | "lutra"
  | "makinoshiro"
  | "miamya"
  | "mirotabasco"
  | "miru"
  | "noerelive0101"
  | "nyoro"
  | "obear"
  | "pedko"
  | "proose"
  | "queenie"
  | "rana"
  | "rayer"
  | "rhe850726"
  | "rumi0813"
  | "ruroro"
  | "rutanbuna"
  | "sakuranoruu"
  | "sanmou"
  | "shalalavtuber"
  | "shaya"
  | "silverbell"
  | "sitwvtuber"
  | "soysaucexd"
  | "sudayoruka"
  | "tedobear"
  | "tedobear2"
  | "tendododo1129"
  | "tsmatch"
  | "twsiriya"
  | "ubye"
  | "umihimeiriya"
  | "usagi"
  | "woofwoffle"
  | "yumemi"
  | "yuna"
  | "zasasa";

export const vtubers: Record<VTuberIds, VTuber> = {
  ahiruibi: {
    id: "ahiruibi",
    youtube: "UCH9Yw2PyGW0AtGltOuVcq_A",
    twitter: "Ahiru_Ibi",
    discord: "ahiruibi",
    facebook: "Ahiru.Ibi",
    default: true,
  },
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
  balaenmlnam: {
    id: "balaenmlnam",
    youtube: "UCUxIkkVP4EIIPhF8M1KRBjw",
    twitter: "Balaen_MLNAM",
    discord: "",
    facebook: "",
    default: true,
  },
  beryllulu: {
    id: "beryllulu",
    youtube: "UCPYNvBYZ8ClPPJ6274K4rVA",
    twitter: "Beryl_lulu",
    discord: "",
    facebook: "Berylulu.tw",
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
  gentotaitan: {
    id: "gentotaitan",
    youtube: "UC3T7xU1_r3-LAx5PKHYyxsg",
    twitter: "GentoTaitan",
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
  jimu0918: {
    id: "jimu0918",
    youtube: "UCqwae8F5d7iwGdf9e932K5w",
    twitter: "Jimu0918",
    discord: "",
    facebook: "",
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
    default: false,
  },
  lumina: {
    id: "lumina",
    youtube: "UCc5cZPorgyc23wKN-Ng1R6w",
    twitter: "lumina16569269",
    discord: "",
    facebook: "broadbandhinet",
    default: false,
  },
  lutra: {
    id: "lutra",
    youtube: "UCmyc8eVR3G9A7hjaHsLR6NQ",
    twitter: "Lutra_rescute",
    discord: "",
    facebook: "RESCUTE119",
    default: true,
  },
  makinoshiro: {
    id: "makinoshiro",
    youtube: "UCbZcxNKrC0a6IZYBowvzAUg",
    twitter: "MakinoShiro",
    discord: "",
    facebook: "",
    default: true,
  },
  miamya: {
    id: "miamya",
    youtube: "UCIR0USMXU0r7N8spBJHNA7A",
    twitter: "MiaMya0615",
    discord: "AspSwcr",
    facebook: "MiaMya0615",
    default: true,
  },
  mirotabasco: {
    id: "mirotabasco",
    youtube: "UCXe8hqIk_Yap31y7EOCMdzg",
    twitter: "mirotabasco",
    discord: "",
    facebook: "basuko.ta",
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
  noerelive0101: {
    id: "noerelive0101",
    youtube: "UCgVuzUu24q8KIDOjJcmCnIQ",
    twitter: "NoeRelive0101",
    discord: "",
    facebook: "NoeYinRelive",
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
  obear: {
    id: "obear",
    youtube: "UCW5O-tjdwofBwfispeMSPfw",
    twitter: "",
    discord: "",
    facebook: "",
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
    default: true,
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
  rhe850726: {
    id: "rhe850726",
    youtube: "UCzDR7vKAgJATmBeUsE3b8cQ",
    twitter: "RHE850726",
    discord: "",
    facebook: "109109321338440",
    default: true,
  },
  rumi0813: {
    id: "rumi0813",
    youtube: "UCswRX8mNNdn1fjRctZqzjgA",
    twitter: "Rumi__0813",
    discord: "",
    facebook: "lanmewko",
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
  rutanbuna: {
    id: "rutanbuna",
    youtube: "UCnSa7dnmEf6bmyS_34yqE_A",
    twitter: "Rutanbuna",
    discord: "",
    facebook: "",
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
  shalalavtuber: {
    id: "shalalavtuber",
    youtube: "UCfSznBOuXiDxON_YUMCSFiQ",
    twitter: "ShalalaVtuber",
    discord: "maRrdC6",
    facebook: "shalalavtuber",
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
  sitwvtuber: {
    id: "sitwvtuber",
    youtube: "UCjv4bfP_67WLuPheS-Z8Ekg",
    twitter: "SiTWVtuber",
    discord: "",
    facebook: "",
    default: true,
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
  tendododo1129: {
    id: "tendododo1129",
    youtube: "UC7P5GH9nvcjP120r62h3v3g",
    twitter: "Tendododo1129",
    discord: "",
    facebook: "Tendo1129",
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
    default: true,
  },
  ubye: {
    id: "ubye",
    youtube: "UC-o-1qjKkMLq-ZFxXIzOUBQ",
    twitter: "UbyeCloud",
    discord: "",
    facebook: "Ubyecloud",
    default: true,
  },
  umihimeiriya: {
    id: "umihimeiriya",
    youtube: "UCv_W2ZpvfrLAzsHqtjWGKYw",
    twitter: "umihimeiriya",
    discord: "AgNGGzmf",
    facebook: "UmihimeIriya",
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
  woofwoffle: {
    id: "woofwoffle",
    youtube: "UCprlKrFgmLW4F_Ec80PWuCw",
    twitter: "woof_woffle",
    discord: "",
    facebook: "",
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
  | "ahiruibi"
  | "amamiyayume"
  | "aoi"
  | "asa"
  | "ayamizuka"
  | "balaenmlnam"
  | "beryllulu"
  | "chilla"
  | "choco"
  | "fengxu"
  | "fifteen"
  | "fujinokuma"
  | "gentotaitan"
  | "haruka"
  | "healingluka"
  | "himemiyayuka"
  | "hoonie"
  | "ikusen"
  | "jimu0918"
  | "kaina"
  | "kurita"
  | "kwakon"
  | "lapis"
  | "lumina"
  | "lutra"
  | "makinoshiro"
  | "miamya"
  | "mirotabasco"
  | "miru"
  | "noerelive0101"
  | "nyoro"
  | "obear"
  | "pedko"
  | "proose"
  | "queenie"
  | "rana"
  | "rayer"
  | "rhe850726"
  | "rumi0813"
  | "ruroro"
  | "rutanbuna"
  | "sakuranoruu"
  | "sanmou"
  | "shalalavtuber"
  | "shaya"
  | "silverbell"
  | "sitwvtuber"
  | "soysaucexd"
  | "sudayoruka"
  | "tedobear"
  | "tedobear2"
  | "tendododo1129"
  | "tsmatch"
  | "twsiriya"
  | "ubye"
  | "umihimeiriya"
  | "usagi"
  | "woofwoffle"
  | "yumemi"
  | "yuna"
  | "zasasa";

type Batch = VTuberIds[];

export const batches: Record<BatchIds, Batch> = {
  "ahiruibi": null,
  "amamiyayume": null,
  "aoi": null,
  "asa": null,
  "ayamizuka": null,
  "balaenmlnam": null,
  "beryllulu": null,
  "chilla": null,
  "choco": null,
  "fengxu": null,
  "fifteen": null,
  "fujinokuma": null,
  "gentotaitan": null,
  "haruka": null,
  "healingluka": null,
  "himemiyayuka": null,
  "hoonie": null,
  "ikusen": null,
  "jimu0918": null,
  "kaina": null,
  "kurita": null,
  "kwakon": null,
  "lapis": null,
  "lumina": null,
  "lutra": null,
  "makinoshiro": null,
  "miamya": null,
  "mirotabasco": null,
  "miru": null,
  "noerelive0101": null,
  "nyoro": null,
  "obear": null,
  "pedko": null,
  "proose": null,
  "queenie": null,
  "rana": null,
  "rayer": null,
  "rhe850726": null,
  "rumi0813": null,
  "ruroro": null,
  "rutanbuna": null,
  "sakuranoruu": null,
  "sanmou": null,
  "shalalavtuber": null,
  "shaya": null,
  "silverbell": null,
  "sitwvtuber": null,
  "soysaucexd": null,
  "sudayoruka": null,
  "tedobear": null,
  "tedobear2": null,
  "tendododo1129": null,
  "tsmatch": null,
  "twsiriya": null,
  "ubye": null,
  "umihimeiriya": null,
  "usagi": null,
  "woofwoffle": null,
  "yumemi": null,
  "yuna": null,
  "zasasa": null,
};