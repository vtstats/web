#![allow(clippy::unreadable_literal)]
#![allow(dead_code)]

#[derive(Debug)]
pub struct VTuber {
    pub name: &'static str,
    pub youtube: Option<&'static str>,
    pub bilibili: Option<usize>,
}

pub const VTUBERS: &[VTuber] = &[
    VTuber {
        name: "hololive",
        youtube: Some("UCJFZiqLMntJufDCHc6bQixg"),
        bilibili: Some(286700005),
    },
    VTuber {
        name: "sora",
        youtube: Some("UCp6993wxpyDPHUpavwDFqgg"),
        bilibili: Some(286179206),
    },
    VTuber {
        name: "roboco",
        youtube: Some("UCDqI2jOz0weumE8s7paEk6g"),
        bilibili: Some(20813493),
    },
    VTuber {
        name: "miko",
        youtube: Some("UC-hM6YJuNYVAmUWxeIr9FeA"),
        bilibili: Some(366690056),
    },
    VTuber {
        name: "suisei",
        youtube: Some("UC5CwaMl1eIgY8h02uZw7u8A"),
        bilibili: Some(9034870),
    },
    VTuber {
        name: "fubuki",
        youtube: Some("UCdn5BQ06XqgXoAxIhbqw5Rg"),
        bilibili: Some(332704117),
    },
    VTuber {
        name: "matsuri",
        youtube: Some("UCQ0UDLQCjY0rmuxCDE38FGg"),
        bilibili: Some(336731767),
    },
    VTuber {
        name: "haato",
        youtube: Some("UC1CfXB_kRs3C-zaeTG3oGyg"),
        bilibili: Some(339567211),
    },
    VTuber {
        name: "haato_alt",
        youtube: Some("UCHj_mh57PVMXhAUDphUQDFA"),
        bilibili: None,
    },
    VTuber {
        name: "aki",
        youtube: Some("UCFTLzh12_nrtzqBPsTCqenA"),
        bilibili: Some(389857131),
    },
    VTuber {
        name: "aki_alt",
        youtube: Some("UCLbtM3JZfRTg8v2KGag-RMw"),
        bilibili: None,
    },
    VTuber {
        name: "mel",
        youtube: Some("UCD8HOxPs4Xvsm8H0ZxXGiBw"),
        bilibili: Some(389856447),
    },
    VTuber {
        name: "choco",
        youtube: Some("UC1suqwovbL1kzsoaZgFZLKg"),
        bilibili: Some(389858754),
    },
    VTuber {
        name: "choco_alt",
        youtube: Some("UCp3tgHXw_HI0QMk1K8qh3gQ"),
        bilibili: None,
    },
    VTuber {
        name: "shion",
        youtube: Some("UCXTpFs_3PqI41qX2d9tL2Rw"),
        bilibili: Some(389857640),
    },
    VTuber {
        name: "aqua",
        youtube: Some("UC1opHUrw8rvnsadT-iGp7Cg"),
        bilibili: Some(375504219),
    },
    VTuber {
        name: "subaru",
        youtube: Some("UCvzGlP9oQwU--Y0r9id_jnA"),
        bilibili: Some(389859190),
    },
    VTuber {
        name: "ayame",
        youtube: Some("UC7fk0CB07ly8oSl0aqKkqFg"),
        bilibili: Some(389858027),
    },
    VTuber {
        name: "pekora",
        youtube: Some("UC1DCedRgGHBdm81E1llLhOQ"),
        bilibili: Some(443305053),
    },
    VTuber {
        name: "rushia",
        youtube: Some("UCl_gCybOJRIgOXw6Qb4qJzQ"),
        bilibili: Some(443300418),
    },
    VTuber {
        name: "flare",
        youtube: Some("UCvInZx9h3jC2JzsIzoOebWg"),
        bilibili: Some(454737600),
    },
    VTuber {
        name: "marine",
        youtube: Some("UCCzUftO8KOVkV4wQG1vkUvg"),
        bilibili: Some(454955503),
    },
    VTuber {
        name: "noel",
        youtube: Some("UCdyqAaZDKHXg4Ahi7VENThQ"),
        bilibili: Some(454733056),
    },
    VTuber {
        name: "kanata",
        youtube: Some("UCZlDXzGoo7d44bwdNObFacg"),
        bilibili: Some(491474048),
    },
    VTuber {
        name: "coco",
        youtube: Some("UCS9uQI-jC3DE0L4IpXyvr6w"),
        bilibili: Some(491474049),
    },
    VTuber {
        name: "watame",
        youtube: Some("UCqm3BQLlJfvkTsX_hvm0UmA"),
        bilibili: Some(491474050),
    },
    VTuber {
        name: "towa",
        youtube: Some("UC1uv2Oq6kNxgATlCiez59hw"),
        bilibili: Some(491474051),
    },
    VTuber {
        name: "himemoriluna",
        youtube: Some("UCa9Y57gfeY0Zro_noHRVrnw"),
        bilibili: Some(491474052),
    },
    VTuber {
        name: "fubuki",
        youtube: Some("UCdn5BQ06XqgXoAxIhbqw5Rg"),
        bilibili: Some(332704117),
    },
    VTuber {
        name: "mio",
        youtube: Some("UCp-5t9SrOQwXMU7iIjQfARg"),
        bilibili: Some(389862071),
    },
    VTuber {
        name: "okayu",
        youtube: Some("UCvaTdHTWBGv3MKj3KVqJVCw"),
        bilibili: Some(412135222),
    },
    VTuber {
        name: "korone",
        youtube: Some("UChAnqc_AY5_I3Px5dig3X1Q"),
        bilibili: Some(412135619),
    },
    VTuber {
        name: "azki",
        youtube: Some("UC0TXe_LYZ4scaW2XMyi5_kw"),
        bilibili: Some(389056211),
    },
    VTuber {
        name: "yogiri",
        youtube: None,
        bilibili: Some(427061218),
    },
    VTuber {
        name: "civia",
        youtube: None,
        bilibili: Some(354411419),
    },
    VTuber {
        name: "echo",
        youtube: None,
        bilibili: Some(456368455),
    },
    VTuber {
        name: "luna",
        youtube: Some("UCQYADFw7xEJ9oZSM5ZbqyBw"),
        bilibili: Some(265224956),
    },
    VTuber {
        name: "nekomiya",
        youtube: Some("UCevD0wKzJFpfIkvHOiQsfLQ"),
        bilibili: Some(291296062),
    },
    VTuber {
        name: "tamaki",
        youtube: Some("UC8NZiqKx6fsDT3AVcMiVFyA"),
        bilibili: Some(12362451),
    },
    VTuber {
        name: "pph",
        youtube: Some("UC1pR2ig6NhndhvicEgclNdA"),
        bilibili: Some(393940396),
    },
    VTuber {
        name: "nana",
        youtube: Some("UCbfv8uuUXt3RSJGEwxny5Rw"),
        bilibili: Some(386900246),
    },
    VTuber {
        name: "ui",
        youtube: Some("UCt30jJgChL8qeT9VPadidSw"),
        bilibili: Some(2601367),
    },
];

pub const VTUBER_IDS: &[&str] = &[
    "aki_alt",
    "aki",
    "aqua",
    "ayame",
    "azki",
    "choco_alt",
    "choco",
    "civia",
    "coco",
    "echo",
    "flare",
    "fubuki",
    "fubuki",
    "haato_alt",
    "haato",
    "himemoriluna",
    "hololive",
    "kanata",
    "korone",
    "luna",
    "marine",
    "matsuri",
    "mel",
    "miko",
    "mio",
    "nana",
    "nekomiya",
    "noel",
    "okayu",
    "pekora",
    "pph",
    "roboco",
    "rushia",
    "shion",
    "sora",
    "subaru",
    "suisei",
    "tamaki",
    "towa",
    "ui",
    "watame",
    "yogiri",
];
