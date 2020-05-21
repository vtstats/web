#![allow(clippy::unreadable_literal)]
#![allow(dead_code)]

#[derive(Debug)]
pub struct VTuber {
    pub name: &'static str,
    pub youtube: Option<&'static str>,
    pub bilibili: Option<usize>,
}

macro_rules! vtubers {
    ($( $name:expr, $youtube:expr, $bilibili:expr, )*) => {
        pub const VTUBERS: &[VTuber] = &[
            $(
                VTuber {
                    name: $name,
                    youtube: $youtube,
                    bilibili: $bilibili
                }
            ),*
        ];
    };
}

vtubers! {
    "hololive",     Some("UCJFZiqLMntJufDCHc6bQixg"), Some(286700005),
    "sora",         Some("UCp6993wxpyDPHUpavwDFqgg"), Some(286179206),
    "roboco",       Some("UCDqI2jOz0weumE8s7paEk6g"), Some(20813493),
    "miko",         Some("UC-hM6YJuNYVAmUWxeIr9FeA"), Some(366690056),
    "suisei",       Some("UC5CwaMl1eIgY8h02uZw7u8A"), Some(9034870),
    "fubuki",       Some("UCdn5BQ06XqgXoAxIhbqw5Rg"), Some(332704117),
    "matsuri",      Some("UCQ0UDLQCjY0rmuxCDE38FGg"), Some(336731767),
    "haato",        Some("UC1CfXB_kRs3C-zaeTG3oGyg"), Some(339567211),
    "aki",          Some("UCFTLzh12_nrtzqBPsTCqenA"), Some(389857131),
    "aki_alt",      Some("UCLbtM3JZfRTg8v2KGag-RMw"), None,
    "mel",          Some("UCD8HOxPs4Xvsm8H0ZxXGiBw"), Some(389856447),
    "choco",        Some("UC1suqwovbL1kzsoaZgFZLKg"), Some(389858754),
    "choco_alt",    Some("UCp3tgHXw_HI0QMk1K8qh3gQ"), None,
    "shion",        Some("UCXTpFs_3PqI41qX2d9tL2Rw"), Some(389857640),
    "aqua",         Some("UC1opHUrw8rvnsadT-iGp7Cg"), Some(375504219),
    "subaru",       Some("UCvzGlP9oQwU--Y0r9id_jnA"), Some(389859190),
    "ayame",        Some("UC7fk0CB07ly8oSl0aqKkqFg"), Some(389858027),
    "pekora",       Some("UC1DCedRgGHBdm81E1llLhOQ"), Some(443305053),
    "rushia",       Some("UCl_gCybOJRIgOXw6Qb4qJzQ"), Some(443300418),
    "flare",        Some("UCvInZx9h3jC2JzsIzoOebWg"), Some(454737600),
    "marine",       Some("UCCzUftO8KOVkV4wQG1vkUvg"), Some(454955503),
    "noel",         Some("UCdyqAaZDKHXg4Ahi7VENThQ"), Some(454733056),
    "kanata",       Some("UCZlDXzGoo7d44bwdNObFacg"), Some(491474048),
    "coco",         Some("UCS9uQI-jC3DE0L4IpXyvr6w"), Some(491474049),
    "watame",       Some("UCqm3BQLlJfvkTsX_hvm0UmA"), Some(491474050),
    "towa",         Some("UC1uv2Oq6kNxgATlCiez59hw"), Some(491474051),
    "himemoriluna", Some("UCa9Y57gfeY0Zro_noHRVrnw"), Some(491474052),
    "mio",          Some("UCp-5t9SrOQwXMU7iIjQfARg"), Some(389862071),
    "okayu",        Some("UCvaTdHTWBGv3MKj3KVqJVCw"), Some(412135222),
    "korone",       Some("UChAnqc_AY5_I3Px5dig3X1Q"), Some(412135619),
    "azki",         Some("UC0TXe_LYZ4scaW2XMyi5_kw"), Some(389056211),
    "yogiri",       None,                             Some(427061218),
    "civia",        None,                             Some(354411419),
    "echo",         None,                             Some(456368455),
    "doris",        None,                             Some(511613156),
    "artia",        None,                             Some(511613155),
    "rosalyn",      None,                             Some(511613157),
    "risu",         Some("UCOyYb1c43VlX9rc_lT6NKQw"), None,
    "moona",        Some("UCP0BspO_AMEe3aQqqpo89Dg"), None,
    "iofi",         Some("UCAoy6rzhSf4ydcYjJw3WoVg"), None,
    "luna",         Some("UCQYADFw7xEJ9oZSM5ZbqyBw"), Some(265224956),
    "nekomiya",     Some("UCevD0wKzJFpfIkvHOiQsfLQ"), Some(291296062),
    "tamaki",       Some("UC8NZiqKx6fsDT3AVcMiVFyA"), Some(12362451),
    "pph",          Some("UC1pR2ig6NhndhvicEgclNdA"), Some(393940396),
    "nana",         Some("UCbfv8uuUXt3RSJGEwxny5Rw"), Some(386900246),
    "ui",           Some("UCt30jJgChL8qeT9VPadidSw"), Some(2601367),
    "rurudo",       Some("UC0qt9BfrpQo-drjuPKl_vdA"), None,
}
