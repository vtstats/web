type VTuber = {
  id: string;
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  default?: true;
};

export type VTuberIds =
  | "aoi"
  | "asa"
  | "haruka"
  | "hoonie"
  | "ikusen"
  | "kaina"
  | "kurita"
  | "kwakon"
  | "miru"
  | "nyoro"
  | "rana"
  | "rayer"
  | "ruroro"
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
  haruka: {
    id: "haruka",
    twitter: "haruka_owl",
    youtube: "UCl1RVJbkPnpNbO9-CsDqPmQ",
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
  shaya: {
    id: "shaya",
    twitter: "About_Shaya",
    youtube: "UCU8O__T_J93Cnoi6HoRoPow",
    default: true,
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
  | "cyberlive"
  | "haruka"
  | "kaina"
  | "kolhunter"
  | "kurita"
  | "kwakon"
  | "miru"
  | "shaya"
  | "tedobear"
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
  "cyberlive": ["nyoro", "yuna"],
  "haruka": null,
  "kaina": null,
  "kolhunter": ["ruroro"],
  "kurita": null,
  "kwakon": null,
  "miru": null,
  "shaya": null,
  "tedobear": null,
  "tsmatch": null,
  "ubye": null,
  "usagi": null,
  "yahoo": ["hoonie"],
  "yenz": ["rana"],
  "yumemi": null,
};