export type VTuberIds =
  | "hololive"
  | "hololive_en"
  | "hololive_id"
  | "yagoo"
  | "sora"
  | "roboco"
  | "miko"
  | "suisei"
  | "fubuki"
  | "matsuri"
  | "haato"
  | "aki"
  | "mel"
  | "choco"
  | "choco_alt"
  | "shion"
  | "aqua"
  | "subaru"
  | "ayame"
  | "pekora"
  | "rushia"
  | "flare"
  | "marine"
  | "noel"
  | "kanata"
  | "coco"
  | "watame"
  | "towa"
  | "himemoriluna"
  | "lamy"
  | "nene"
  | "botan"
  | "polka"
  | "laplus"
  | "lui"
  | "koyori"
  | "chloe"
  | "iroha"
  | "mio"
  | "okayu"
  | "korone"
  | "azki"
  | "risu"
  | "moona"
  | "iofi"
  | "ollie"
  | "melfissa"
  | "reine"
  | "vestia"
  | "kaela"
  | "kobo"
  | "amelia"
  | "calliope"
  | "gura"
  | "inanis"
  | "kiara"
  | "irys"
  | "sana"
  | "ceres"
  | "ouro"
  | "mumei"
  | "hakos"
  | "luna"
  | "nekomiya"
  | "tamaki"
  | "nana"
  | "ui"
  | "pochimaru"
  | "ayamy"
  | "nabi"
  | "miyabi"
  | "izuru"
  | "aruran"
  | "rikka"
  | "astel"
  | "temma"
  | "roberu"
  | "shien"
  | "oga"
  | "fuma"
  | "uyu"
  | "gamma"
  | "rio"
  | "regis_altare"
  | "magni_dezmond"
  | "axel_syrios"
  | "noir_vesper";

export type BatchIds =
  | "hololive_offical"
  | "hololive_staff"
  | "hololive_og"
  | "hololive_1st"
  | "hololive_2nd"
  | "hololive_3rd"
  | "hololive_4th"
  | "hololive_5th"
  | "hololive_6th"
  | "hololive_gamers"
  | "hololive_id_1st"
  | "hololive_id_2nd"
  | "hololive_id_3rd"
  | "hololive_en_myth"
  | "hololive_en_council"
  | "hololive_en_vsinger"
  | "holostars_1st"
  | "holostars_2nd"
  | "holostars_3rd"
  | "holostars_uproar"
  | "holostars_en_tempus"
  | "hololive_affiliated"
  | "others";

export type VTuber = {
  id: VTuberIds;
  batch: BatchIds | BatchIds[];
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  default?: true;
};

const v: VTuber[] = [
  {
    id: "hololive",
    batch: "hololive_offical",
    twitter: "hololivetv",
    youtube: "UCJFZiqLMntJufDCHc6bQixg",
    bilibili: 286700005,
    default: true,
  },
  {
    id: "hololive_en",
    batch: "hololive_offical",
    twitter: "hololive_En",
    youtube: "UCotXwY6s8pWmuWd_snKYjhg",
    default: true,
  },
  {
    id: "hololive_id",
    batch: "hololive_offical",
    twitter: "hololive_Id",
    youtube: "UCfrWoRGlawPQDQxxeIDRP0Q",
    default: true,
  },
  {
    id: "yagoo",
    batch: "hololive_staff",
    twitter: "tanigox",
    youtube: "UCu2DMOGLeR_DSStCyeQpi5Q",
  },
  {
    id: "sora",
    batch: "hololive_og",
    twitter: "tokino_sora",
    youtube: "UCp6993wxpyDPHUpavwDFqgg",
    bilibili: 286179206,
    default: true,
  },
  {
    id: "roboco",
    batch: "hololive_og",
    twitter: "robocosan",
    youtube: "UCDqI2jOz0weumE8s7paEk6g",
    bilibili: 20813493,
    default: true,
  },
  {
    id: "miko",
    batch: "hololive_og",
    twitter: "sakuramiko35",
    youtube: "UC-hM6YJuNYVAmUWxeIr9FeA",
    bilibili: 366690056,
    default: true,
  },
  {
    id: "suisei",
    batch: "hololive_og",
    twitter: "suisei_hosimati",
    youtube: "UC5CwaMl1eIgY8h02uZw7u8A",
    bilibili: 9034870,
    default: true,
  },
  {
    id: "azki",
    batch: "hololive_og",
    twitter: "AZKi_VDiVA",
    youtube: "UC0TXe_LYZ4scaW2XMyi5_kw",
    bilibili: 389056211,
    default: true,
  },
  {
    id: "fubuki",
    batch: ["hololive_1st", "hololive_gamers"],
    twitter: "shirakamifubuki",
    youtube: "UCdn5BQ06XqgXoAxIhbqw5Rg",
    bilibili: 332704117,
    default: true,
  },
  {
    id: "matsuri",
    batch: "hololive_1st",
    twitter: "natsuiromatsuri",
    youtube: "UCQ0UDLQCjY0rmuxCDE38FGg",
    bilibili: 336731767,
    default: true,
  },
  {
    id: "haato",
    batch: "hololive_1st",
    twitter: "akaihaato",
    youtube: "UC1CfXB_kRs3C-zaeTG3oGyg",
    bilibili: 339567211,
    default: true,
  },
  {
    id: "aki",
    batch: "hololive_1st",
    twitter: "akirosenthal",
    youtube: "UCFTLzh12_nrtzqBPsTCqenA",
    bilibili: 389857131,
    default: true,
  },
  {
    id: "mel",
    batch: "hololive_1st",
    twitter: "yozoramel",
    youtube: "UCD8HOxPs4Xvsm8H0ZxXGiBw",
    bilibili: 389856447,
    default: true,
  },
  {
    id: "choco",
    batch: "hololive_2nd",
    twitter: "yuzukichococh",
    youtube: "UC1suqwovbL1kzsoaZgFZLKg",
    bilibili: 389858754,
    default: true,
  },
  {
    id: "choco_alt",
    batch: "hololive_2nd",
    twitter: "yuzukichococh",
    youtube: "UCp3tgHXw_HI0QMk1K8qh3gQ",
    default: true,
  },
  {
    id: "shion",
    batch: "hololive_2nd",
    twitter: "murasakishionch",
    youtube: "UCXTpFs_3PqI41qX2d9tL2Rw",
    bilibili: 389857640,
    default: true,
  },
  {
    id: "aqua",
    batch: "hololive_2nd",
    twitter: "minatoaqua",
    youtube: "UC1opHUrw8rvnsadT-iGp7Cg",
    bilibili: 375504219,
    default: true,
  },
  {
    id: "subaru",
    batch: "hololive_2nd",
    twitter: "oozorasubaru",
    youtube: "UCvzGlP9oQwU--Y0r9id_jnA",
    bilibili: 389859190,
    default: true,
  },
  {
    id: "ayame",
    batch: "hololive_2nd",
    twitter: "nakiriayame",
    youtube: "UC7fk0CB07ly8oSl0aqKkqFg",
    bilibili: 389858027,
    default: true,
  },
  {
    id: "pekora",
    batch: "hololive_3rd",
    twitter: "usadapekora",
    youtube: "UC1DCedRgGHBdm81E1llLhOQ",
    bilibili: 443305053,
    default: true,
  },
  {
    id: "rushia",
    batch: "hololive_3rd",
    twitter: "uruharushia",
    youtube: "UCl_gCybOJRIgOXw6Qb4qJzQ",
    bilibili: 443300418,
    default: true,
  },
  {
    id: "flare",
    batch: "hololive_3rd",
    twitter: "shiranuiflare",
    youtube: "UCvInZx9h3jC2JzsIzoOebWg",
    bilibili: 454737600,
    default: true,
  },
  {
    id: "marine",
    batch: "hololive_3rd",
    twitter: "houshoumarine",
    youtube: "UCCzUftO8KOVkV4wQG1vkUvg",
    bilibili: 454955503,
    default: true,
  },
  {
    id: "noel",
    batch: "hololive_3rd",
    twitter: "shiroganenoel",
    youtube: "UCdyqAaZDKHXg4Ahi7VENThQ",
    bilibili: 454733056,
    default: true,
  },
  {
    id: "kanata",
    batch: "hololive_4th",
    twitter: "amanekanatach",
    youtube: "UCZlDXzGoo7d44bwdNObFacg",
    bilibili: 491474048,
    default: true,
  },
  {
    id: "coco",
    batch: "hololive_4th",
    twitter: "kiryucoco",
    youtube: "UCS9uQI-jC3DE0L4IpXyvr6w",
    bilibili: 491474049,
    default: true,
  },
  {
    id: "watame",
    batch: "hololive_4th",
    twitter: "tsunomakiwatame",
    youtube: "UCqm3BQLlJfvkTsX_hvm0UmA",
    bilibili: 491474050,
    default: true,
  },
  {
    id: "towa",
    batch: "hololive_4th",
    twitter: "tokoyamitowa",
    youtube: "UC1uv2Oq6kNxgATlCiez59hw",
    bilibili: 491474051,
    default: true,
  },
  {
    id: "himemoriluna",
    batch: "hololive_4th",
    twitter: "himemoriluna",
    youtube: "UCa9Y57gfeY0Zro_noHRVrnw",
    bilibili: 491474052,
    default: true,
  },
  {
    id: "lamy",
    batch: "hololive_5th",
    twitter: "yukihanalamy",
    youtube: "UCFKOVgVbGmX65RxO3EtH3iw",
    bilibili: 624252706,
    default: true,
  },
  {
    id: "nene",
    batch: "hololive_5th",
    twitter: "momosuzunene",
    youtube: "UCAWSyEs_Io8MtpY3m-zqILA",
    bilibili: 624252709,
    default: true,
  },
  {
    id: "botan",
    batch: "hololive_5th",
    twitter: "shishirobotan",
    youtube: "UCUKD-uaobj9jiqB-VXt71mA",
    bilibili: 624252710,
    default: true,
  },
  {
    id: "polka",
    batch: "hololive_5th",
    twitter: "omarupolka",
    youtube: "UCK9V2B22uJYu3N7eR_BT9QA",
    bilibili: 624252712,
    default: true,
  },
  {
    id: "laplus",
    batch: "hololive_6th",
    twitter: "LaplusDarknesss",
    youtube: "UCENwRMx5Yh42zWpzURebzTw",
    default: true,
  },
  {
    id: "lui",
    batch: "hololive_6th",
    twitter: "takanelui",
    youtube: "UCs9_O1tRPMQTHQ-N_L6FU2g",
    default: true,
  },
  {
    id: "koyori",
    batch: "hololive_6th",
    twitter: "hakuikoyori",
    youtube: "UC6eWCld0KwmyHFbAqK3V-Rw",
    default: true,
  },
  {
    id: "chloe",
    batch: "hololive_6th",
    twitter: "sakamatachloe",
    youtube: "UCIBY1ollUsauvVi4hW4cumw",
    default: true,
  },
  {
    id: "iroha",
    batch: "hololive_6th",
    twitter: "kazamairohach",
    youtube: "UC_vMYWcDjmfdpH6r4TTn1MQ",
    default: true,
  },
  {
    id: "mio",
    batch: "hololive_gamers",
    twitter: "ookamimio",
    youtube: "UCp-5t9SrOQwXMU7iIjQfARg",
    bilibili: 389862071,
    default: true,
  },
  {
    id: "okayu",
    batch: "hololive_gamers",
    twitter: "nekomataokayu",
    youtube: "UCvaTdHTWBGv3MKj3KVqJVCw",
    bilibili: 412135222,
    default: true,
  },
  {
    id: "korone",
    batch: "hololive_gamers",
    twitter: "inugamikorone",
    youtube: "UChAnqc_AY5_I3Px5dig3X1Q",
    bilibili: 412135619,
    default: true,
  },
  {
    id: "risu",
    batch: "hololive_id_1st",
    twitter: "ayunda_risu",
    youtube: "UCOyYb1c43VlX9rc_lT6NKQw",
    default: true,
  },
  {
    id: "moona",
    batch: "hololive_id_1st",
    twitter: "moonahoshinova",
    youtube: "UCP0BspO_AMEe3aQqqpo89Dg",
    default: true,
  },
  {
    id: "iofi",
    batch: "hololive_id_1st",
    twitter: "airaniiofifteen",
    youtube: "UCAoy6rzhSf4ydcYjJw3WoVg",
    default: true,
  },
  {
    id: "ollie",
    batch: "hololive_id_2nd",
    twitter: "kureijiollie",
    youtube: "UCYz_5n-uDuChHtLo7My1HnQ",
    default: true,
  },
  {
    id: "melfissa",
    batch: "hololive_id_2nd",
    twitter: "anyamelfissa",
    youtube: "UC727SQYUvx5pDDGQpTICNWg",
    default: true,
  },
  {
    id: "reine",
    batch: "hololive_id_2nd",
    twitter: "pavoliareine",
    youtube: "UChgTyjG-pdNvxxhdsXfHQ5Q",
    default: true,
  },
  {
    id: "vestia",
    batch: "hololive_id_3rd",
    twitter: "vestiazeta",
    youtube: "UCTvHWSfBZgtxE4sILOaurIQ",
    default: true,
  },
  {
    id: "kaela",
    batch: "hololive_id_3rd",
    twitter: "kaelakovalskia",
    youtube: "UCZLZ8Jjx_RN2CXloOmgTHVg",
    default: true,
  },
  {
    id: "kobo",
    batch: "hololive_id_3rd",
    twitter: "kobokanaeru",
    youtube: "UCjLEmnpCNeisMxy134KPwWw",
    default: true,
  },
  {
    id: "amelia",
    batch: "hololive_en_myth",
    twitter: "watsonameliaEN",
    youtube: "UCyl1z3jo3XHR1riLFKG5UAg",
    bilibili: 674600649,
    default: true,
  },
  {
    id: "calliope",
    batch: "hololive_en_myth",
    twitter: "moricalliope",
    youtube: "UCL_qhgtOy0dy1Agp8vkySQg",
    bilibili: 674600645,
    default: true,
  },
  {
    id: "gura",
    batch: "hololive_en_myth",
    twitter: "gawrgura",
    youtube: "UCoSrY_IQQVpmIRZ9Xf-y93g",
    bilibili: 674600648,
    default: true,
  },
  {
    id: "inanis",
    batch: "hololive_en_myth",
    twitter: "ninomaeinanis",
    youtube: "UCMwGHR0BTZuLsmjY_NT5Pwg",
    bilibili: 674600647,
    default: true,
  },
  {
    id: "kiara",
    batch: "hololive_en_myth",
    twitter: "takanashikiara",
    youtube: "UCHsx4Hqa-1ORjQTh9TYDhww",
    bilibili: 674600646,
    default: true,
  },
  {
    id: "irys",
    batch: "hololive_en_vsinger",
    twitter: "irys_en",
    youtube: "UC8rcEBzJSleTkf_-agPM20g",
    default: true,
  },
  {
    id: "sana",
    batch: "hololive_en_council",
    twitter: "tsukumosana",
    youtube: "UCsUj0dszADCGbF3gNrQEuSQ",
    default: true,
  },
  {
    id: "ceres",
    batch: "hololive_en_council",
    twitter: "ceresfauna",
    youtube: "UCO_aKKYxn4tvrqPjcTzZ6EQ",
    default: true,
  },
  {
    id: "ouro",
    batch: "hololive_en_council",
    twitter: "ourokronii",
    youtube: "UCmbs8T6MWqUHP1tIQvSgKrg",
    default: true,
  },
  {
    id: "mumei",
    batch: "hololive_en_council",
    twitter: "nanashimumei_en",
    youtube: "UC3n5uGu18FoCy23ggWWp8tA",
    default: true,
  },
  {
    id: "hakos",
    batch: "hololive_en_council",
    twitter: "hakosbaelz",
    youtube: "UCgmPnx-EEeOrZSg5Tiw7ZRQ",
    default: true,
  },
  {
    id: "miyabi",
    batch: "holostars_1st",
    twitter: "miyabihanasaki",
    youtube: "UC6t3-_N8A6ME1JShZHHqOMw",
  },
  {
    id: "izuru",
    batch: "holostars_1st",
    twitter: "kanadeizuru",
    youtube: "UCZgOv3YDEs-ZnZWDYVwJdmA",
  },
  {
    id: "aruran",
    batch: "holostars_1st",
    twitter: "arurandeisu",
    youtube: "UCKeAhJvy8zgXWbh9duVjIaQ",
  },
  {
    id: "rikka",
    batch: "holostars_1st",
    twitter: "rikkaroid",
    youtube: "UC9mf_ZVpouoILRY9NUIaK-w",
  },
  {
    id: "astel",
    batch: "holostars_2nd",
    twitter: "astelleda",
    youtube: "UCNVEsYbiZjH5QLmGeSgTSzg",
  },
  {
    id: "temma",
    batch: "holostars_2nd",
    twitter: "kishidotemma",
    youtube: "UCGNI4MENvnsymYjKiZwv9eg",
  },
  {
    id: "roberu",
    batch: "holostars_2nd",
    twitter: "yukokuroberu",
    youtube: "UCANDOlYTJT7N5jlRC3zfzVA",
  },
  {
    id: "shien",
    batch: "holostars_3rd",
    twitter: "kageyamashien",
    youtube: "UChSvpZYRPh0FvG4SJGSga3g",
  },
  {
    id: "oga",
    batch: "holostars_3rd",
    twitter: "aragamioga",
    youtube: "UCwL7dgTxKo8Y4RFIKWaf8gA",
  },
  {
    id: "fuma",
    batch: "holostars_uproar",
    twitter: "yatogamifuma",
    youtube: "UCc88OV45ICgHbn3ZqLLb52w",
  },
  {
    id: "uyu",
    batch: "holostars_uproar",
    twitter: "utsugiuyu",
    youtube: "UCgRqGV1gBf2Esxh0Tz1vxzw",
  },
  {
    id: "gamma",
    batch: "holostars_uproar",
    twitter: "hizakigamma",
    youtube: "UCkT1u65YS49ca_LsFwcTakw",
  },
  {
    id: "rio",
    batch: "holostars_uproar",
    twitter: "minaserioch",
    youtube: "UCdfMHxjcCc2HSd9qFvfJgjg",
  },
  {
    id: "regis_altare",
    batch: "holostars_en_tempus",
    twitter: "regisaltare",
    youtube: "UCyxtGMdWlURZ30WSnEjDOQw",
  },
  {
    id: "magni_dezmond",
    batch: "holostars_en_tempus",
    twitter: "magnidezmond",
    youtube: "UC7MMNHR-kf9EN1rXiesMTMw",
  },
  {
    id: "axel_syrios",
    batch: "holostars_en_tempus",
    twitter: "axelsyrios",
    youtube: "UC2hx0xVkMoHGWijwr_lA01w",
  },
  {
    id: "noir_vesper",
    batch: "holostars_en_tempus",
    twitter: "noirvesper_en",
    youtube: "UCDRWSO281bIHYVi-OV3iFYA",
  },
  {
    id: "ayamy",
    batch: "hololive_affiliated",
    twitter: "ayamy_garubinu",
    youtube: "UCr9p1ZjLKgfaoqNorY7PiWQ",
    bilibili: 521070071,
    default: true,
  },
  {
    id: "nabi",
    batch: "hololive_affiliated",
    twitter: "nab0i",
    youtube: "UCzKkwB84Y0ql0EvyOWRSkEw",
    default: true,
  },
  {
    id: "pochimaru",
    batch: "hololive_affiliated",
    twitter: "lizhi3",
    youtube: "UC22BVlBsZc6ta3Dqz75NU6Q",
    default: true,
  },
  {
    id: "nana",
    batch: "hololive_affiliated",
    twitter: "nana_kaguraaa",
    youtube: "UCbfv8uuUXt3RSJGEwxny5Rw",
    bilibili: 386900246,
    default: true,
  },
  {
    id: "ui",
    batch: "hololive_affiliated",
    twitter: "ui_shig",
    youtube: "UCt30jJgChL8qeT9VPadidSw",
    bilibili: 2601367,
    default: true,
  },
  {
    id: "luna",
    batch: "others",
    twitter: "_KaguyaLuna",
    youtube: "UCQYADFw7xEJ9oZSM5ZbqyBw",
    bilibili: 265224956,
  },
  {
    id: "nekomiya",
    batch: "others",
    twitter: "Nekomiya_Hinata",
    youtube: "UCevD0wKzJFpfIkvHOiQsfLQ",
    bilibili: 291296062,
  },
  {
    id: "tamaki",
    batch: "others",
    twitter: "norioo_",
    youtube: "UC8NZiqKx6fsDT3AVcMiVFyA",
    bilibili: 12362451,
  },
];

export const vtubers = v.reduce((acc, v) => {
  acc[v.id] = {
    id: v.id,
    batch: v.batch,
    twitter: v.twitter,
    youtube: v.youtube,
    bilibili: v.bilibili,
    default: v.default,
  };
  return acc;
}, {} as Record<VTuberIds, VTuber>);

export const batches = v.reduce((acc, v) => {
  const ids = Array.isArray(v.batch) ? v.batch : [v.batch];

  for (const id of ids) {
    if (acc[id]) {
      acc[id].push(v.id);
    } else {
      acc[id] = [v.id];
    }
  }

  return acc;
}, {} as Record<BatchIds, VTuberIds[]>);
