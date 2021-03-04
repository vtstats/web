type VTuber = {
  id: string;
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  default?: true;
};

export type VTuberIds =
  | "miru"
  | "ubye"
  | "hoonie"
  | "rayer"
  | "rana"
  | "shaya"
  | "ruroro"
  | "kwakon"
  | "ikusen"
  | "aoi"
  | "usagi"
  | "haruka"
  | "tsmatch"
  | "tedobear"
  | "kurita"
  | "asa"
  | "kaina"
  | "nyoro"
  | "yuna"
  | "yumemi";

export const vtubers: Record<VTuberIds, VTuber> = {
  miru: {
    id: "miru",
    twitter: "AnninMirudayo",
    youtube: "UCFahBR2wixu0xOex84bXFvg",
    default: true,
  },
  ubye: {
    id: "ubye",
    twitter: "UbyeCloud",
    youtube: "UC-o-1qjKkMLq-ZFxXIzOUBQ",
    default: true,
  },
  hoonie: {
    id: "hoonie",
    twitter: "hooniefriends",
    youtube: "UC6s0wLR0TZauzTVoGGw2r6g",
    default: true,
  },
  rayer: {
    id: "rayer",
    twitter: "ACGInspector",
    youtube: "UCDb47NT3QzoCiorDtK9C_qg",
    default: true,
  },
  rana: {
    id: "rana",
    twitter: "RanaVtb",
    youtube: "UCFEd5V7VcxBPPcuMGpmvkQA",
    default: true,
  },
  shaya: {
    id: "shaya",
    twitter: "About_Shaya",
    youtube: "UCU8O__T_J93Cnoi6HoRoPow",
    default: true,
  },
  ruroro: {
    id: "ruroro",
    twitter: "ruroroismek",
    youtube: "UCRf7OJA3azS4RsGd_G96FUw",
    default: true,
  },
  kwakon: {
    id: "kwakon",
    twitter: "kwa_kon",
    youtube: "UCyZZMKRn-mUEkPzaqa9b6bg",
    default: true,
  },
  ikusen: {
    id: "ikusen",
    twitter: "Ikusen_",
    youtube: "UCKazkVudNQs8ZhwfXj_RNPw",
    default: true,
  },
  aoi: {
    id: "aoi",
    twitter: "SummerAoi_0810",
    youtube: "UCLZyaaUwBw2ZvwLt6uY3_bQ",
    default: true,
  },
  usagi: {
    id: "usagi",
    twitter: "kuroxusagihime",
    youtube: "UC0u_-3zgLkSYpQOxlBi-5Ng",
    default: true,
  },
  haruka: {
    id: "haruka",
    twitter: "haruka_owl",
    youtube: "UCl1RVJbkPnpNbO9-CsDqPmQ",
    default: true,
  },
  tsmatch: {
    id: "tsmatch",
    twitter: "Tsmatch_T96",
    youtube: "UCXzEDlhV7wJuMY4c-Fvz7uQ",
    default: true,
  },
  tedobear: {
    id: "tedobear",
    twitter: "VirtualTedobear",
    youtube: "UCqy310kNTAokme7plaXTwQw",
    default: true,
  },
  kurita: {
    id: "kurita",
    twitter: "nezumiyakurita",
    youtube: "UCsvSrfDReAqYM32_VW8t09w",
    default: true,
  },
  asa: {
    id: "asa",
    twitter: "AsaIfrit",
    youtube: "UCxm2qC7Z7cjDAd6yPyl-sKQ",
    default: true,
  },
  kaina: {
    id: "kaina",
    twitter: "kaina0124",
    youtube: "UCN7sEdAjj4Q--al9pDsCPOg",
    default: true,
  },
  nyoro: {
    id: "nyoro",
    twitter: "NyoroVanilla",
    youtube: "UC4J0GZLM55qrFh2L-ZAb2LA",
    default: true,
  },
  yuna: {
    id: "yuna",
    twitter: "Mizunoyuna1",
    youtube: "UCjj4xu_HzcrOr9Jsltw0gCQ",
    default: true,
  },
  yumemi: {
    id: "yumemi",
    twitter: "Kumonoue_Yumemi",
    youtube: "UCRUFY2ZCyVOvC-1rJIVZlKg",
    default: true,
  },
};

export type BatchIds =
  | "miru"
  | "ubye"
  | "shaya"
  | "kwakon"
  | "aoi"
  | "usagi"
  | "haruka"
  | "tsmatch"
  | "tedobear"
  | "kurita"
  | "asa"
  | "kaina"
  | "yumemi"
// Company
  | "yahoo"
  | "kolhunter"
  | "acclaim"
  | "acg"
  | "yenz"
  | "cyberlive";

type Batch = VTuberIds[];

export const batches: Record<BatchIds, Batch> = {
  miru: null,
  ubye: null,
  shaya: null,
  kwakon: null,
  aoi: null,
  usagi: null,
  haruka: null,
  tsmatch: null,
  tedobear: null,
  kurita: null,
  asa: null,
  kaina: null,
  yumemi: null,
  yahoo: ["hoonie"],
  kolhunter: ["ruroro"],
  acclaim: ["ikusen"],
  acg: ["rayer"],
  yenz: ["rana"],
  cyberlive: ["nyoro", "yuna"],
};
