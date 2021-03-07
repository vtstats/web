type VTuber = {
  id: string;
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  default?: boolean;
};

export type VTuberIds =
  | "aoi"
  | "asa"
  | "fengxu"
  | "fifteen"
  | "fujinokuma"
  | "haruka"
  | "himemiyayuka"
  | "hoonie"
  | "ikusen"
  | "kaina"
  | "kurita"
  | "kwakon"
  | "lapis"
  | "lumina"
  | "miru"
  | "nyoro"
  | "pedko"
  | "rana"
  | "rayer"
  | "ruroro"
  | "sanmou"
  | "shaya"
  | "tedobear"
  | "tsmatch"
  | "ubye"
  | "usagi"
  | "yumemi"
  | "yuna";

export const vtubers: Record<VTuberIds, VTuber> = {
  aoi: {
    id: "aoi",
    twitter: "SummerAoi_0810",
    youtube: "UCLZyaaUwBw2ZvwLt6uY3_bQ",
    default: true,
  },
  asa: {
    id: "asa",
    twitter: "AsaIfrit",
    youtube: "UCxm2qC7Z7cjDAd6yPyl-sKQ",
    default: true,
  },
  fengxu: {
    id: "fengxu",
    twitter: "FengXu_vtb",
    youtube: "UCYPSP_gJ-BcREmsDzBIaRvw",
    default: true,
  },
  fifteen: {
    id: "fifteen",
    twitter: "no15_rescute",
    youtube: "UC_UqaRNrLcaL4fp2IAPV0OQ",
    default: false,
  },
  fujinokuma: {
    id: "fujinokuma",
    twitter: "fujinokuma_mama",
    youtube: "UCmyDLzP9ZBAK2JO4kUuJMRQ",
    default: true,
  },
  haruka: {
    id: "haruka",
    twitter: "haruka_owl",
    youtube: "UCl1RVJbkPnpNbO9-CsDqPmQ",
    default: true,
  },
  himemiyayuka: {
    id: "himemiyayuka",
    twitter: "Hana_Yuukaa",
    youtube: "UC1d1dmxkh_yanq1U1gli7jw",
    default: true,
  },
  hoonie: {
    id: "hoonie",
    twitter: "hooniefriends",
    youtube: "UC6s0wLR0TZauzTVoGGw2r6g",
    default: true,
  },
  ikusen: {
    id: "ikusen",
    twitter: "Ikusen_",
    youtube: "UCKazkVudNQs8ZhwfXj_RNPw",
    default: true,
  },
  kaina: {
    id: "kaina",
    twitter: "kaina0124",
    youtube: "UCN7sEdAjj4Q--al9pDsCPOg",
    default: true,
  },
  kurita: {
    id: "kurita",
    twitter: "nezumiyakurita",
    youtube: "UCsvSrfDReAqYM32_VW8t09w",
    default: true,
  },
  kwakon: {
    id: "kwakon",
    twitter: "kwa_kon",
    youtube: "UCyZZMKRn-mUEkPzaqa9b6bg",
    default: true,
  },
  lapis: {
    id: "lapis",
    twitter: "ryoukenlapis",
    youtube: "UCb_9R8SZy_HSJi53zxVh7kg",
    default: true,
  },
  lumina: {
    id: "lumina",
    twitter: "lumina16569269",
    youtube: "UCc5cZPorgyc23wKN-Ng1R6w",
    default: true,
  },
  miru: {
    id: "miru",
    twitter: "AnninMirudayo",
    youtube: "UCFahBR2wixu0xOex84bXFvg",
    default: true,
  },
  nyoro: {
    id: "nyoro",
    twitter: "NyoroVanilla",
    youtube: "UC4J0GZLM55qrFh2L-ZAb2LA",
    default: true,
  },
  pedko: {
    id: "pedko",
    twitter: "Padko_tablet",
    youtube: "UC2yG-9ekUwTs8Q0yMSycMxA",
    default: true,
  },
  rana: {
    id: "rana",
    twitter: "RanaVtb",
    youtube: "UCFEd5V7VcxBPPcuMGpmvkQA",
    default: true,
  },
  rayer: {
    id: "rayer",
    twitter: "ACGInspector",
    youtube: "UCDb47NT3QzoCiorDtK9C_qg",
    default: true,
  },
  ruroro: {
    id: "ruroro",
    twitter: "ruroroismek",
    youtube: "UCRf7OJA3azS4RsGd_G96FUw",
    default: true,
  },
  sanmou: {
    id: "sanmou",
    twitter: "3MouDolp",
    youtube: "UCPqYxut8IQxG4HAMrJx5ffQ",
    default: true,
  },
  shaya: {
    id: "shaya",
    twitter: "About_Shaya",
    youtube: "UCU8O__T_J93Cnoi6HoRoPow",
    default: false,
  },
  tedobear: {
    id: "tedobear",
    twitter: "VirtualTedobear",
    youtube: "UCqy310kNTAokme7plaXTwQw",
    default: true,
  },
  tsmatch: {
    id: "tsmatch",
    twitter: "Tsmatch_T96",
    youtube: "UCXzEDlhV7wJuMY4c-Fvz7uQ",
    default: true,
  },
  ubye: {
    id: "ubye",
    twitter: "UbyeCloud",
    youtube: "UC-o-1qjKkMLq-ZFxXIzOUBQ",
    default: true,
  },
  usagi: {
    id: "usagi",
    twitter: "kuroxusagihime",
    youtube: "UC0u_-3zgLkSYpQOxlBi-5Ng",
    default: true,
  },
  yumemi: {
    id: "yumemi",
    twitter: "Kumonoue_Yumemi",
    youtube: "UCRUFY2ZCyVOvC-1rJIVZlKg",
    default: true,
  },
  yuna: {
    id: "yuna",
    twitter: "Mizunoyuna1",
    youtube: "UCjj4xu_HzcrOr9Jsltw0gCQ",
    default: true,
  },
};

export type BatchIds =
  | "acclaim"
  | "acg"
  | "aoi"
  | "asa"
  | "changing"
  | "cyberlive"
  | "fengxu"
  | "fourvtuber"
  | "fujinokuma"
  | "haruka"
  | "himemiyayuka"
  | "hinet"
  | "kaina"
  | "kolhunter"
  | "kurita"
  | "kwakon"
  | "lapis"
  | "miru"
  | "shaya"
  | "tsmatch"
  | "ubye"
  | "usagi"
  | "yahoo"
  | "yenz"
  | "yumemi";

type Batch = VTuberIds[];

export const batches: Record<BatchIds, Batch> = {
  "acclaim": ["ikusen"],
  "acg": ["rayer"],
  "aoi": null,
  "asa": null,
  "changing": ["fifteen", "pedko"],
  "cyberlive": ["nyoro", "yuna"],
  "fengxu": null,
  "fourvtuber": ["sanmou", "tedobear"],
  "fujinokuma": null,
  "haruka": null,
  "himemiyayuka": null,
  "hinet": ["lumina"],
  "kaina": null,
  "kolhunter": ["ruroro"],
  "kurita": null,
  "kwakon": null,
  "lapis": null,
  "miru": null,
  "shaya": null,
  "tsmatch": null,
  "ubye": null,
  "usagi": null,
  "yahoo": ["hoonie"],
  "yenz": ["rana"],
  "yumemi": null,
};
