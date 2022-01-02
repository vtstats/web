type VTuber = {
  id: string;
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  default?: true;
  image: string;
};

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
  | "oga";

export const vtubers: Record<VTuberIds, VTuber> = {
  hololive: {
    id: "hololive",
    twitter: "hololivetv",
    youtube: "UCJFZiqLMntJufDCHc6bQixg",
    bilibili: 286700005,
    default: true,
    image: "e36068cc-9bfb-4f9b-dcbe-549e81f7db00",
  },
  hololive_en: {
    id: "hololive_en",
    twitter: "hololive_En",
    youtube: "UCotXwY6s8pWmuWd_snKYjhg",
    default: true,
    image: "e36068cc-9bfb-4f9b-dcbe-549e81f7db00",
  },
  hololive_id: {
    id: "hololive_id",
    twitter: "hololive_Id",
    youtube: "UCfrWoRGlawPQDQxxeIDRP0Q",
    default: true,
    image: "e36068cc-9bfb-4f9b-dcbe-549e81f7db00",
  },
  yagoo: {
    id: "yagoo",
    twitter: "tanigox",
    youtube: "UCu2DMOGLeR_DSStCyeQpi5Q",
    image: "520909d6-ba50-489e-45ab-1ebcd3e01e00",
  },
  sora: {
    id: "sora",
    twitter: "tokino_sora",
    youtube: "UCp6993wxpyDPHUpavwDFqgg",
    bilibili: 286179206,
    default: true,
    image: "8c8b8424-bb6d-4d6d-4290-2188aede2800",
  },
  roboco: {
    id: "roboco",
    twitter: "robocosan",
    youtube: "UCDqI2jOz0weumE8s7paEk6g",
    bilibili: 20813493,
    default: true,
    image: "cb64cf7b-a81b-47a9-3973-b63a734d9100",
  },
  miko: {
    id: "miko",
    twitter: "sakuramiko35",
    youtube: "UC-hM6YJuNYVAmUWxeIr9FeA",
    bilibili: 366690056,
    default: true,
    image: "f84786b6-cb55-4164-70a0-72760ab4b900",
  },
  suisei: {
    id: "suisei",
    twitter: "suisei_hosimati",
    youtube: "UC5CwaMl1eIgY8h02uZw7u8A",
    bilibili: 9034870,
    default: true,
    image: "ab2e4109-6bd0-41c4-a9af-2a6f4a6ad200",
  },
  fubuki: {
    id: "fubuki",
    twitter: "shirakamifubuki",
    youtube: "UCdn5BQ06XqgXoAxIhbqw5Rg",
    bilibili: 332704117,
    default: true,
    image: "baf182d4-19c0-43a5-9ded-8f2d3e42ee00",
  },
  matsuri: {
    id: "matsuri",
    twitter: "natsuiromatsuri",
    youtube: "UCQ0UDLQCjY0rmuxCDE38FGg",
    bilibili: 336731767,
    default: true,
    image: "c1025621-fd62-4e67-c6ad-93a1cab4f300",
  },
  haato: {
    id: "haato",
    twitter: "akaihaato",
    youtube: "UC1CfXB_kRs3C-zaeTG3oGyg",
    bilibili: 339567211,
    default: true,
    image: "5a889988-2f67-4493-6933-b185d930ca00",
  },
  aki: {
    id: "aki",
    twitter: "akirosenthal",
    youtube: "UCFTLzh12_nrtzqBPsTCqenA",
    bilibili: 389857131,
    default: true,
    image: "f44e3f6b-a206-4313-215a-239221ad5700",
  },
  mel: {
    id: "mel",
    twitter: "yozoramel",
    youtube: "UCD8HOxPs4Xvsm8H0ZxXGiBw",
    bilibili: 389856447,
    default: true,
    image: "e8f432b7-1095-4a96-4da4-a07732168b00",
  },
  choco: {
    id: "choco",
    twitter: "yuzukichococh",
    youtube: "UC1suqwovbL1kzsoaZgFZLKg",
    bilibili: 389858754,
    default: true,
    image: "b9f4327b-a93e-47ed-0da4-343cda4d1000",
  },
  choco_alt: {
    id: "choco_alt",
    twitter: "yuzukichococh",
    youtube: "UCp3tgHXw_HI0QMk1K8qh3gQ",
    default: true,
    image: "e22f2b87-50d1-4c04-e8a3-76e98b23d000",
  },
  shion: {
    id: "shion",
    twitter: "murasakishionch",
    youtube: "UCXTpFs_3PqI41qX2d9tL2Rw",
    bilibili: 389857640,
    default: true,
    image: "adc27b0e-974d-4ee7-42cb-70fdce9dc700",
  },
  aqua: {
    id: "aqua",
    twitter: "minatoaqua",
    youtube: "UC1opHUrw8rvnsadT-iGp7Cg",
    bilibili: 375504219,
    default: true,
    image: "8b836dbf-c08f-4a47-135a-6631a0564b00",
  },
  subaru: {
    id: "subaru",
    twitter: "oozorasubaru",
    youtube: "UCvzGlP9oQwU--Y0r9id_jnA",
    bilibili: 389859190,
    default: true,
    image: "00d4913c-662e-4009-aa77-f0dfed986a00",
  },
  ayame: {
    id: "ayame",
    twitter: "nakiriayame",
    youtube: "UC7fk0CB07ly8oSl0aqKkqFg",
    bilibili: 389858027,
    default: true,
    image: "662103bc-2fa3-4d03-f5ee-00bbbf64fc00",
  },
  pekora: {
    id: "pekora",
    twitter: "usadapekora",
    youtube: "UC1DCedRgGHBdm81E1llLhOQ",
    bilibili: 443305053,
    default: true,
    image: "9991f36a-9a49-41dd-cb6c-40946a606e00",
  },
  rushia: {
    id: "rushia",
    twitter: "uruharushia",
    youtube: "UCl_gCybOJRIgOXw6Qb4qJzQ",
    bilibili: 443300418,
    default: true,
    image: "ac33ae26-6211-4cd3-a6b6-9b565cb67100",
  },
  flare: {
    id: "flare",
    twitter: "shiranuiflare",
    youtube: "UCvInZx9h3jC2JzsIzoOebWg",
    bilibili: 454737600,
    default: true,
    image: "7d3d7d65-446b-4e7c-9655-eb8e99441d00",
  },
  marine: {
    id: "marine",
    twitter: "houshoumarine",
    youtube: "UCCzUftO8KOVkV4wQG1vkUvg",
    bilibili: 454955503,
    default: true,
    image: "e71db2d2-beb1-460d-3000-642c13edd900",
  },
  noel: {
    id: "noel",
    twitter: "shiroganenoel",
    youtube: "UCdyqAaZDKHXg4Ahi7VENThQ",
    bilibili: 454733056,
    default: true,
    image: "896e7cb4-a22b-4ed4-a876-475b56294200",
  },
  kanata: {
    id: "kanata",
    twitter: "amanekanatach",
    youtube: "UCZlDXzGoo7d44bwdNObFacg",
    bilibili: 491474048,
    default: true,
    image: "0b098f1d-5b30-4aa0-a2df-c81c9cd60200",
  },
  coco: {
    id: "coco",
    twitter: "kiryucoco",
    youtube: "UCS9uQI-jC3DE0L4IpXyvr6w",
    bilibili: 491474049,
    default: true,
    image: "d62dcc86-10ca-4487-593f-a8246aa07f00",
  },
  watame: {
    id: "watame",
    twitter: "tsunomakiwatame",
    youtube: "UCqm3BQLlJfvkTsX_hvm0UmA",
    bilibili: 491474050,
    default: true,
    image: "77423ca4-6feb-4b19-73d8-a65e43f98500",
  },
  towa: {
    id: "towa",
    twitter: "tokoyamitowa",
    youtube: "UC1uv2Oq6kNxgATlCiez59hw",
    bilibili: 491474051,
    default: true,
    image: "d0e161a3-b0f8-4ad1-7bba-c6278624e500",
  },
  himemoriluna: {
    id: "himemoriluna",
    twitter: "himemoriluna",
    youtube: "UCa9Y57gfeY0Zro_noHRVrnw",
    bilibili: 491474052,
    default: true,
    image: "bd5244d0-4265-4cda-e1d0-db3593753600",
  },
  lamy: {
    id: "lamy",
    twitter: "yukihanalamy",
    youtube: "UCFKOVgVbGmX65RxO3EtH3iw",
    bilibili: 624252706,
    default: true,
    image: "12dd694d-42ed-4617-510d-d685e0516a00",
  },
  nene: {
    id: "nene",
    twitter: "momosuzunene",
    youtube: "UCAWSyEs_Io8MtpY3m-zqILA",
    bilibili: 624252709,
    default: true,
    image: "d8b7d3bb-3e0c-4f27-146f-a0f449aca600",
  },
  botan: {
    id: "botan",
    twitter: "shishirobotan",
    youtube: "UCUKD-uaobj9jiqB-VXt71mA",
    bilibili: 624252710,
    default: true,
    image: "651b0198-440b-482b-4976-81def5127c00",
  },
  polka: {
    id: "polka",
    twitter: "omarupolka",
    youtube: "UCK9V2B22uJYu3N7eR_BT9QA",
    bilibili: 624252712,
    default: true,
    image: "73d64060-bdd0-4b8e-1488-d5b537967800",
  },
  laplus: {
    id: "laplus",
    twitter: "LaplusDarknesss",
    youtube: "UCENwRMx5Yh42zWpzURebzTw",
    default: true,
    image: "9ba1d379-42c1-4781-8ace-e39157c40a00",
  },
  lui: {
    id: "lui",
    twitter: "takanelui",
    youtube: "UCs9_O1tRPMQTHQ-N_L6FU2g",
    default: true,
    image: "0c5238a7-ae5c-4ce0-b9ef-3379d8c60400",
  },
  koyori: {
    id: "koyori",
    twitter: "hakuikoyori",
    youtube: "UC6eWCld0KwmyHFbAqK3V-Rw",
    default: true,
    image: "8a48e4d1-d091-4830-f7e3-69c7d57b1100",
  },
  chloe: {
    id: "chloe",
    twitter: "sakamatachloe",
    youtube: "UCIBY1ollUsauvVi4hW4cumw",
    default: true,
    image: "32a39c00-9682-4ff4-ffe6-5e361f5aea00",
  },
  iroha: {
    id: "iroha",
    twitter: "kazamairohach",
    youtube: "UC_vMYWcDjmfdpH6r4TTn1MQ",
    default: true,
    image: "10afb540-8f95-4327-743f-8c6b98949f00",
  },
  mio: {
    id: "mio",
    twitter: "ookamimio",
    youtube: "UCp-5t9SrOQwXMU7iIjQfARg",
    bilibili: 389862071,
    default: true,
    image: "0cb3fbd5-a877-4e84-5708-af7cabb6f400",
  },
  okayu: {
    id: "okayu",
    twitter: "nekomataokayu",
    youtube: "UCvaTdHTWBGv3MKj3KVqJVCw",
    bilibili: 412135222,
    default: true,
    image: "a3451769-4224-42f6-cb60-009ed5034400",
  },
  korone: {
    id: "korone",
    twitter: "inugamikorone",
    youtube: "UChAnqc_AY5_I3Px5dig3X1Q",
    bilibili: 412135619,
    default: true,
    image: "392382fb-6f86-4995-506c-b9680d967d00",
  },
  azki: {
    id: "azki",
    twitter: "AZKi_VDiVA",
    youtube: "UC0TXe_LYZ4scaW2XMyi5_kw",
    bilibili: 389056211,
    default: true,
    image: "9622ea69-81fe-46ef-186f-868b07d58600",
  },
  risu: {
    id: "risu",
    twitter: "ayunda_risu",
    youtube: "UCOyYb1c43VlX9rc_lT6NKQw",
    default: true,
    image: "0692ef9c-6686-4935-6f98-cd3f0b501d00",
  },
  moona: {
    id: "moona",
    twitter: "moonahoshinova",
    youtube: "UCP0BspO_AMEe3aQqqpo89Dg",
    default: true,
    image: "594cd486-5c9d-4817-df36-b3f258f47500",
  },
  iofi: {
    id: "iofi",
    twitter: "airaniiofifteen",
    youtube: "UCAoy6rzhSf4ydcYjJw3WoVg",
    default: true,
    image: "a5850e95-46f6-4231-4ee0-4dc23050a400",
  },
  ollie: {
    id: "ollie",
    twitter: "kureijiollie",
    youtube: "UCYz_5n-uDuChHtLo7My1HnQ",
    default: true,
    image: "04189f91-4626-400a-fc3e-16d4e4296500",
  },
  melfissa: {
    id: "melfissa",
    twitter: "anyamelfissa",
    youtube: "UC727SQYUvx5pDDGQpTICNWg",
    default: true,
    image: "7f436be5-a305-4b68-f8a1-08a2a70f2f00",
  },
  reine: {
    id: "reine",
    twitter: "pavoliareine",
    youtube: "UChgTyjG-pdNvxxhdsXfHQ5Q",
    default: true,
    image: "cdbe08f9-2121-407e-bbc6-64f98d833200",
  },
  amelia: {
    id: "amelia",
    twitter: "watsonameliaEN",
    youtube: "UCyl1z3jo3XHR1riLFKG5UAg",
    bilibili: 674600649,
    default: true,
    image: "b0251ee5-9bb6-426b-4091-66170512f400",
  },
  calliope: {
    id: "calliope",
    twitter: "moricalliope",
    youtube: "UCL_qhgtOy0dy1Agp8vkySQg",
    bilibili: 674600645,
    default: true,
    image: "03754447-9bf9-4149-35d9-6dc7be26d000",
  },
  gura: {
    id: "gura",
    twitter: "gawrgura",
    youtube: "UCoSrY_IQQVpmIRZ9Xf-y93g",
    bilibili: 674600648,
    default: true,
    image: "eb8d3e93-8ef0-445d-6639-9ee69dfaa800",
  },
  inanis: {
    id: "inanis",
    twitter: "ninomaeinanis",
    youtube: "UCMwGHR0BTZuLsmjY_NT5Pwg",
    bilibili: 674600647,
    default: true,
    image: "ed19af7b-d932-4a61-289c-18cab13ed700",
  },
  kiara: {
    id: "kiara",
    twitter: "takanashikiara",
    youtube: "UCHsx4Hqa-1ORjQTh9TYDhww",
    bilibili: 674600646,
    default: true,
    image: "b64fe61e-e88e-487c-f8c1-410bc8d99200",
  },
  irys: {
    id: "irys",
    twitter: "irys_en",
    youtube: "UC8rcEBzJSleTkf_-agPM20g",
    default: true,
    image: "295ecb5e-7305-4c0b-dfa1-b4ac29166c00",
  },
  sana: {
    id: "sana",
    twitter: "tsukumosana",
    youtube: "UCsUj0dszADCGbF3gNrQEuSQ",
    default: true,
    image: "ee65c7e9-8f43-4956-cb73-810178a4df00",
  },
  ceres: {
    id: "ceres",
    twitter: "ceresfauna",
    youtube: "UCO_aKKYxn4tvrqPjcTzZ6EQ",
    default: true,
    image: "22d7ebb6-62c0-48f8-9e8f-86a084498b00",
  },
  ouro: {
    id: "ouro",
    twitter: "ourokronii",
    youtube: "UCmbs8T6MWqUHP1tIQvSgKrg",
    default: true,
    image: "fc325b8d-abe0-4b68-5584-662acb95cf00",
  },
  mumei: {
    id: "mumei",
    twitter: "nanashimumei_en",
    youtube: "UC3n5uGu18FoCy23ggWWp8tA",
    default: true,
    image: "d9a015e2-b358-4f13-0a93-6b11f97da100",
  },
  hakos: {
    id: "hakos",
    twitter: "hakosbaelz",
    youtube: "UCgmPnx-EEeOrZSg5Tiw7ZRQ",
    default: true,
    image: "0052bca6-2fc4-4a7d-ac99-2561d89fca00",
  },
  luna: {
    id: "luna",
    twitter: "_KaguyaLuna",
    youtube: "UCQYADFw7xEJ9oZSM5ZbqyBw",
    bilibili: 265224956,
    image: "612dc26a-505c-4c31-b2ec-56b9b9d39f00",
  },
  nekomiya: {
    id: "nekomiya",
    twitter: "Nekomiya_Hinata",
    youtube: "UCevD0wKzJFpfIkvHOiQsfLQ",
    bilibili: 291296062,
    image: "d5c55694-5147-4ca5-0f44-bc24d5288300",
  },
  tamaki: {
    id: "tamaki",
    twitter: "norioo_",
    youtube: "UC8NZiqKx6fsDT3AVcMiVFyA",
    bilibili: 12362451,
    image: "2a5ed9b2-ed7f-4f14-ae98-b0fec5778c00",
  },
  nana: {
    id: "nana",
    twitter: "nana_kaguraaa",
    youtube: "UCbfv8uuUXt3RSJGEwxny5Rw",
    bilibili: 386900246,
    default: true,
    image: "d741fc77-7489-4698-4372-87f59e284600",
  },
  ui: {
    id: "ui",
    twitter: "ui_shig",
    youtube: "UCt30jJgChL8qeT9VPadidSw",
    bilibili: 2601367,
    default: true,
    image: "3338f86d-85c1-43e2-1f01-0067afdc4d00",
  },
  pochimaru: {
    id: "pochimaru",
    twitter: "lizhi3",
    youtube: "UC22BVlBsZc6ta3Dqz75NU6Q",
    default: true,
    image: "74837a5f-da9b-4ece-5fe5-87d908f61e00",
  },
  ayamy: {
    id: "ayamy",
    twitter: "ayamy_garubinu",
    youtube: "UCr9p1ZjLKgfaoqNorY7PiWQ",
    bilibili: 521070071,
    default: true,
    image: "1dd58454-c12b-48dd-ee05-2abf67b0ef00",
  },
  nabi: {
    id: "nabi",
    twitter: "nab0i",
    youtube: "UCzKkwB84Y0ql0EvyOWRSkEw",
    default: true,
    image: "e3d0c53f-e94b-42bd-bcbf-f784e95f5600",
  },
  miyabi: {
    id: "miyabi",
    twitter: "miyabihanasaki",
    youtube: "UC6t3-_N8A6ME1JShZHHqOMw",
    image: "93172b62-601d-4c05-77d5-c8190afb1e00",
  },
  izuru: {
    id: "izuru",
    twitter: "kanadeizuru",
    youtube: "UCZgOv3YDEs-ZnZWDYVwJdmA",
    image: "beb296da-fbb6-4af7-fa00-cc9a011cfc00",
  },
  aruran: {
    id: "aruran",
    twitter: "arurandeisu",
    youtube: "UCKeAhJvy8zgXWbh9duVjIaQ",
    image: "3e5e5f4c-0a09-4a5b-4f2e-217d1f015b00",
  },
  rikka: {
    id: "rikka",
    twitter: "rikkaroid",
    youtube: "UC9mf_ZVpouoILRY9NUIaK-w",
    image: "6d3f3a97-1722-447b-3d79-2c4f90edcc00",
  },
  astel: {
    id: "astel",
    twitter: "astelleda",
    youtube: "UCNVEsYbiZjH5QLmGeSgTSzg",
    image: "6221e9a1-1892-498e-4947-c1d663165000",
  },
  temma: {
    id: "temma",
    twitter: "kishidotemma",
    youtube: "UCGNI4MENvnsymYjKiZwv9eg",
    image: "1c628354-53c3-4d73-6d93-80839fa89800",
  },
  roberu: {
    id: "roberu",
    twitter: "yukokuroberu",
    youtube: "UCANDOlYTJT7N5jlRC3zfzVA",
    image: "ffef770c-1301-463f-5d21-eff5d5dd6500",
  },
  shien: {
    id: "shien",
    twitter: "kageyamashien",
    youtube: "UChSvpZYRPh0FvG4SJGSga3g",
    image: "558efb48-f6e4-4006-6caa-ec0b002b5200",
  },
  oga: {
    id: "oga",
    twitter: "aragamioga",
    youtube: "UCwL7dgTxKo8Y4RFIKWaf8gA",
    image: "0a8bf2b6-616b-4c45-ad62-3858a6264300",
  },
};

export type BatchIds =
  | "hololive"
  | "yagoo"
  | "hololive_og"
  | "hololive_1st"
  | "hololive_2nd"
  | "hololive_3rd"
  | "hololive_4th"
  | "hololive_5th"
  | "hololive_6th"
  | "hololive_gamers"
  | "innk_music"
  | "hololive_id_1st"
  | "hololive_id_2nd"
  | "hololive_en_myth"
  | "hololive_en_council"
  | "hololive_en_vsinger"
  | "holostars_1st"
  | "holostars_2nd"
  | "holostars_3rd"
  | "others";

type Batch = VTuberIds[];

export const batches: Record<BatchIds, Batch> = {
  hololive: ["hololive", "hololive_en", "hololive_id"],
  yagoo: null,
  hololive_og: ["sora", "roboco", "miko", "suisei"],
  hololive_1st: ["fubuki", "matsuri", "haato", "aki", "mel"],
  hololive_2nd: ["choco", "choco_alt", "shion", "aqua", "subaru", "ayame"],
  hololive_3rd: ["pekora", "rushia", "flare", "marine", "noel"],
  hololive_4th: ["kanata", "coco", "watame", "towa", "himemoriluna"],
  hololive_5th: ["lamy", "nene", "botan", "polka"],
  hololive_6th: ["chloe", "iroha", "koyori", "laplus", "lui"],
  hololive_gamers: ["fubuki", "mio", "okayu", "korone"],
  innk_music: ["azki"],
  hololive_id_1st: ["risu", "moona", "iofi"],
  hololive_id_2nd: ["ollie", "melfissa", "reine"],
  hololive_en_myth: ["amelia", "calliope", "gura", "inanis", "kiara"],
  hololive_en_vsinger: ["irys"],
  hololive_en_council: ["sana", "ceres", "ouro", "mumei", "hakos"],
  holostars_1st: ["miyabi", "izuru", "aruran", "rikka"],
  holostars_2nd: ["astel", "temma", "roberu"],
  holostars_3rd: ["shien", "oga"],
  others: [
    "luna",
    "nekomiya",
    "tamaki",
    "nana",
    "ui",
    "ayamy",
    "pochimaru",
    "nabi",
  ],
};
