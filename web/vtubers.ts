type VTuber = {
  id: string;
  twitter?: string;
  youtube?: string;
  bilibili?: number;
  default?: true;
};

export type VTuberIds =
  | "hololive"
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
  },
  yagoo: {
    id: "yagoo",
    twitter: "tanigox",
    youtube: "UCu2DMOGLeR_DSStCyeQpi5Q",
  },
  sora: {
    id: "sora",
    twitter: "tokino_sora",
    youtube: "UCp6993wxpyDPHUpavwDFqgg",
    bilibili: 286179206,
    default: true,
  },
  roboco: {
    id: "roboco",
    twitter: "robocosan",
    youtube: "UCDqI2jOz0weumE8s7paEk6g",
    bilibili: 20813493,
    default: true,
  },
  miko: {
    id: "miko",
    twitter: "sakuramiko35",
    youtube: "UC-hM6YJuNYVAmUWxeIr9FeA",
    bilibili: 366690056,
    default: true,
  },
  suisei: {
    id: "suisei",
    twitter: "suisei_hosimati",
    youtube: "UC5CwaMl1eIgY8h02uZw7u8A",
    bilibili: 9034870,
    default: true,
  },
  fubuki: {
    id: "fubuki",
    twitter: "shirakamifubuki",
    youtube: "UCdn5BQ06XqgXoAxIhbqw5Rg",
    bilibili: 332704117,
    default: true,
  },
  matsuri: {
    id: "matsuri",
    twitter: "natsuiromatsuri",
    youtube: "UCQ0UDLQCjY0rmuxCDE38FGg",
    bilibili: 336731767,
    default: true,
  },
  haato: {
    id: "haato",
    twitter: "akaihaato",
    youtube: "UC1CfXB_kRs3C-zaeTG3oGyg",
    bilibili: 339567211,
    default: true,
  },
  aki: {
    id: "aki",
    twitter: "akirosenthal",
    youtube: "UCFTLzh12_nrtzqBPsTCqenA",
    bilibili: 389857131,
    default: true,
  },
  mel: {
    id: "mel",
    twitter: "yozoramel",
    youtube: "UCD8HOxPs4Xvsm8H0ZxXGiBw",
    bilibili: 389856447,
    default: true,
  },
  choco: {
    id: "choco",
    twitter: "yuzukichococh",
    youtube: "UC1suqwovbL1kzsoaZgFZLKg",
    bilibili: 389858754,
    default: true,
  },
  choco_alt: {
    id: "choco_alt",
    twitter: "yuzukichococh",
    youtube: "UCp3tgHXw_HI0QMk1K8qh3gQ",
    default: true,
  },
  shion: {
    id: "shion",
    twitter: "murasakishionch",
    youtube: "UCXTpFs_3PqI41qX2d9tL2Rw",
    bilibili: 389857640,
    default: true,
  },
  aqua: {
    id: "aqua",
    twitter: "minatoaqua",
    youtube: "UC1opHUrw8rvnsadT-iGp7Cg",
    bilibili: 375504219,
    default: true,
  },
  subaru: {
    id: "subaru",
    twitter: "oozorasubaru",
    youtube: "UCvzGlP9oQwU--Y0r9id_jnA",
    bilibili: 389859190,
    default: true,
  },
  ayame: {
    id: "ayame",
    twitter: "nakiriayame",
    youtube: "UC7fk0CB07ly8oSl0aqKkqFg",
    bilibili: 389858027,
    default: true,
  },
  pekora: {
    id: "pekora",
    twitter: "usadapekora",
    youtube: "UC1DCedRgGHBdm81E1llLhOQ",
    bilibili: 443305053,
    default: true,
  },
  rushia: {
    id: "rushia",
    twitter: "uruharushia",
    youtube: "UCl_gCybOJRIgOXw6Qb4qJzQ",
    bilibili: 443300418,
    default: true,
  },
  flare: {
    id: "flare",
    twitter: "shiranuiflare",
    youtube: "UCvInZx9h3jC2JzsIzoOebWg",
    bilibili: 454737600,
    default: true,
  },
  marine: {
    id: "marine",
    twitter: "houshoumarine",
    youtube: "UCCzUftO8KOVkV4wQG1vkUvg",
    bilibili: 454955503,
    default: true,
  },
  noel: {
    id: "noel",
    twitter: "shiroganenoel",
    youtube: "UCdyqAaZDKHXg4Ahi7VENThQ",
    bilibili: 454733056,
    default: true,
  },
  kanata: {
    id: "kanata",
    twitter: "amanekanatach",
    youtube: "UCZlDXzGoo7d44bwdNObFacg",
    bilibili: 491474048,
    default: true,
  },
  coco: {
    id: "coco",
    twitter: "kiryucoco",
    youtube: "UCS9uQI-jC3DE0L4IpXyvr6w",
    bilibili: 491474049,
    default: true,
  },
  watame: {
    id: "watame",
    twitter: "tsunomakiwatame",
    youtube: "UCqm3BQLlJfvkTsX_hvm0UmA",
    bilibili: 491474050,
    default: true,
  },
  towa: {
    id: "towa",
    twitter: "tokoyamitowa",
    youtube: "UC1uv2Oq6kNxgATlCiez59hw",
    bilibili: 491474051,
    default: true,
  },
  himemoriluna: {
    id: "himemoriluna",
    twitter: "himemoriluna",
    youtube: "UCa9Y57gfeY0Zro_noHRVrnw",
    bilibili: 491474052,
    default: true,
  },
  lamy: {
    id: "lamy",
    twitter: "yukihanalamy",
    youtube: "UCFKOVgVbGmX65RxO3EtH3iw",
    bilibili: 624252706,
    default: true,
  },
  nene: {
    id: "nene",
    twitter: "momosuzunene",
    youtube: "UCAWSyEs_Io8MtpY3m-zqILA",
    bilibili: 624252709,
    default: true,
  },
  botan: {
    id: "botan",
    twitter: "shishirobotan",
    youtube: "UCUKD-uaobj9jiqB-VXt71mA",
    bilibili: 624252710,
    default: true,
  },
  polka: {
    id: "polka",
    twitter: "omarupolka",
    youtube: "UCK9V2B22uJYu3N7eR_BT9QA",
    bilibili: 624252712,
    default: true,
  },
  mio: {
    id: "mio",
    twitter: "ookamimio",
    youtube: "UCp-5t9SrOQwXMU7iIjQfARg",
    bilibili: 389862071,
    default: true,
  },
  okayu: {
    id: "okayu",
    twitter: "nekomataokayu",
    youtube: "UCvaTdHTWBGv3MKj3KVqJVCw",
    bilibili: 412135222,
    default: true,
  },
  korone: {
    id: "korone",
    twitter: "inugamikorone",
    youtube: "UChAnqc_AY5_I3Px5dig3X1Q",
    bilibili: 412135619,
    default: true,
  },
  azki: {
    id: "azki",
    twitter: "AZKi_VDiVA",
    youtube: "UC0TXe_LYZ4scaW2XMyi5_kw",
    bilibili: 389056211,
    default: true,
  },
  risu: {
    id: "risu",
    twitter: "ayunda_risu",
    youtube: "UCOyYb1c43VlX9rc_lT6NKQw",
    default: true,
  },
  moona: {
    id: "moona",
    twitter: "moonahoshinova",
    youtube: "UCP0BspO_AMEe3aQqqpo89Dg",
    default: true,
  },
  iofi: {
    id: "iofi",
    twitter: "airaniiofifteen",
    youtube: "UCAoy6rzhSf4ydcYjJw3WoVg",
    default: true,
  },
  ollie: {
    id: "ollie",
    twitter: "kureijiollie",
    youtube: "UCYz_5n-uDuChHtLo7My1HnQ",
    default: true,
  },
  melfissa: {
    id: "melfissa",
    twitter: "anyamelfissa",
    youtube: "UC727SQYUvx5pDDGQpTICNWg",
    default: true,
  },
  reine: {
    id: "reine",
    twitter: "pavoliareine",
    youtube: "UChgTyjG-pdNvxxhdsXfHQ5Q",
    default: true,
  },
  amelia: {
    id: "amelia",
    twitter: "watsonameliaEN",
    youtube: "UCyl1z3jo3XHR1riLFKG5UAg",
    bilibili: 674600649,
    default: true,
  },
  calliope: {
    id: "calliope",
    twitter: "moricalliope",
    youtube: "UCL_qhgtOy0dy1Agp8vkySQg",
    bilibili: 674600645,
    default: true,
  },
  gura: {
    id: "gura",
    twitter: "gawrgura",
    youtube: "UCoSrY_IQQVpmIRZ9Xf-y93g",
    bilibili: 674600648,
    default: true,
  },
  inanis: {
    id: "inanis",
    twitter: "ninomaeinanis",
    youtube: "UCMwGHR0BTZuLsmjY_NT5Pwg",
    bilibili: 674600647,
    default: true,
  },
  kiara: {
    id: "kiara",
    twitter: "takanashikiara",
    youtube: "UCHsx4Hqa-1ORjQTh9TYDhww",
    bilibili: 674600646,
    default: true,
  },
  irys: {
    id: "irys",
    twitter: "irys_en",
    youtube: "UC8rcEBzJSleTkf_-agPM20g",
    default: true,
  },

  sana: {
    id: "sana",
    twitter: "tsukumosana",
    youtube: "UCsUj0dszADCGbF3gNrQEuSQ",
    default: true,
  },
  ceres: {
    id: "ceres",
    twitter: "ceresfauna",
    youtube: "UCO_aKKYxn4tvrqPjcTzZ6EQ",
    default: true,
  },
  ouro: {
    id: "ouro",
    twitter: "ourokronii",
    youtube: "UCmbs8T6MWqUHP1tIQvSgKrg",
    default: true,
  },
  mumei: {
    id: "mumei",
    twitter: "nanashimumei_en",
    youtube: "UC3n5uGu18FoCy23ggWWp8tA",
    default: true,
  },
  hakos: {
    id: "hakos",
    twitter: "hakosbaelz",
    youtube: "UCgmPnx-EEeOrZSg5Tiw7ZRQ",
    default: true,
  },

  luna: {
    id: "luna",
    twitter: "_KaguyaLuna",
    youtube: "UCQYADFw7xEJ9oZSM5ZbqyBw",
    bilibili: 265224956,
  },
  nekomiya: {
    id: "nekomiya",
    twitter: "Nekomiya_Hinata",
    youtube: "UCevD0wKzJFpfIkvHOiQsfLQ",
    bilibili: 291296062,
  },
  tamaki: {
    id: "tamaki",
    twitter: "norioo_",
    youtube: "UC8NZiqKx6fsDT3AVcMiVFyA",
    bilibili: 12362451,
  },
  nana: {
    id: "nana",
    twitter: "nana_kaguraaa",
    youtube: "UCbfv8uuUXt3RSJGEwxny5Rw",
    bilibili: 386900246,
    default: true,
  },
  ui: {
    id: "ui",
    twitter: "ui_shig",
    youtube: "UCt30jJgChL8qeT9VPadidSw",
    bilibili: 2601367,
    default: true,
  },
  pochimaru: {
    id: "pochimaru",
    twitter: "lizhi3",
    youtube: "UC22BVlBsZc6ta3Dqz75NU6Q",
    default: true,
  },
  ayamy: {
    id: "ayamy",
    twitter: "ayamy_garubinu",
    youtube: "UCr9p1ZjLKgfaoqNorY7PiWQ",
    bilibili: 521070071,
    default: true,
  },
  nabi: {
    id: "nabi",
    twitter: "nab0i",
    youtube: "UCzKkwB84Y0ql0EvyOWRSkEw",
    default: true,
  },
  miyabi: {
    id: "miyabi",
    twitter: "miyabihanasaki",
    youtube: "UC6t3-_N8A6ME1JShZHHqOMw",
  },
  izuru: {
    id: "izuru",
    twitter: "kanadeizuru",
    youtube: "UCZgOv3YDEs-ZnZWDYVwJdmA",
  },
  aruran: {
    id: "aruran",
    twitter: "arurandeisu",
    youtube: "UCKeAhJvy8zgXWbh9duVjIaQ",
  },
  rikka: {
    id: "rikka",
    twitter: "rikkaroid",
    youtube: "UC9mf_ZVpouoILRY9NUIaK-w",
  },
  astel: {
    id: "astel",
    twitter: "astelleda",
    youtube: "UCNVEsYbiZjH5QLmGeSgTSzg",
  },
  temma: {
    id: "temma",
    twitter: "kishidotemma",
    youtube: "UCGNI4MENvnsymYjKiZwv9eg",
  },
  roberu: {
    id: "roberu",
    twitter: "yukokuroberu",
    youtube: "UCANDOlYTJT7N5jlRC3zfzVA",
  },
  shien: {
    id: "shien",
    twitter: "kageyamashien",
    youtube: "UChSvpZYRPh0FvG4SJGSga3g",
  },
  oga: {
    id: "oga",
    twitter: "aragamioga",
    youtube: "UCwL7dgTxKo8Y4RFIKWaf8gA",
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
  hololive: null,
  yagoo: null,
  hololive_og: ["sora", "roboco", "miko", "suisei"],
  hololive_1st: ["fubuki", "matsuri", "haato", "aki", "mel"],
  hololive_2nd: ["choco", "choco_alt", "shion", "aqua", "subaru", "ayame"],
  hololive_3rd: ["pekora", "rushia", "flare", "marine", "noel"],
  hololive_4th: ["kanata", "coco", "watame", "towa", "himemoriluna"],
  hololive_5th: ["lamy", "nene", "botan", "polka"],
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
