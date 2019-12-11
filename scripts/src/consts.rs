#![allow(clippy::unreadable_literal)]
#![allow(dead_code)]

#[derive(Debug)]
pub struct VTuber {
    pub name: &'static str,
    pub youtube: Option<&'static str>,
    pub bilibili: Option<usize>,
}

impl VTuber {
    const fn new(
        name: &'static str,
        youtube: Option<&'static str>,
        bilibili: Option<usize>,
    ) -> Self {
        VTuber {
            name,
            youtube,
            bilibili,
        }
    }
}

pub const VTUBERS: [VTuber; 35] = [
    VTuber::new("aki", Some("UCFTLzh12_nrtzqBPsTCqenA"), Some(389857131)),
    VTuber::new("aki_alt", Some("UCLbtM3JZfRTg8v2KGag-RMw"), None),
    VTuber::new("aqua", Some("UC1opHUrw8rvnsadT-iGp7Cg"), Some(375504219)),
    VTuber::new("ayame", Some("UC7fk0CB07ly8oSl0aqKkqFg"), Some(389858027)),
    VTuber::new("azki", Some("UC0TXe_LYZ4scaW2XMyi5_kw"), Some(389056211)),
    VTuber::new("choco", Some("UC1suqwovbL1kzsoaZgFZLKg"), Some(389858754)),
    VTuber::new("choco_alt", Some("UCp3tgHXw_HI0QMk1K8qh3gQ"), None),
    VTuber::new("flare", Some("UCvInZx9h3jC2JzsIzoOebWg"), Some(454737600)),
    VTuber::new("fubuki", Some("UCdn5BQ06XqgXoAxIhbqw5Rg"), Some(332704117)),
    VTuber::new("haato", Some("UC1CfXB_kRs3C-zaeTG3oGyg"), Some(339567211)),
    VTuber::new(
        "hololive",
        Some("UCJFZiqLMntJufDCHc6bQixg"),
        Some(286700005),
    ),
    VTuber::new("korone", Some("UChAnqc_AY5_I3Px5dig3X1Q"), Some(412135619)),
    VTuber::new("luna", Some("UCQYADFw7xEJ9oZSM5ZbqyBw"), Some(265224956)),
    VTuber::new("marine", Some("UCCzUftO8KOVkV4wQG1vkUvg"), Some(454955503)),
    VTuber::new("matsuri", Some("UCQ0UDLQCjY0rmuxCDE38FGg"), Some(336731767)),
    VTuber::new("mel", Some("UCD8HOxPs4Xvsm8H0ZxXGiBw"), Some(389856447)),
    VTuber::new("miko", Some("UC-hM6YJuNYVAmUWxeIr9FeA"), Some(366690056)),
    VTuber::new("mio", Some("UCp-5t9SrOQwXMU7iIjQfARg"), Some(389862071)),
    VTuber::new("nana", Some("UCbfv8uuUXt3RSJGEwxny5Rw"), Some(386900246)),
    VTuber::new(
        "nekomiya",
        Some("UCevD0wKzJFpfIkvHOiQsfLQ"),
        Some(291296062),
    ),
    VTuber::new("noel", Some("UCdyqAaZDKHXg4Ahi7VENThQ"), Some(454733056)),
    VTuber::new("okayu", Some("UCvaTdHTWBGv3MKj3KVqJVCw"), Some(412135222)),
    VTuber::new("pekora", Some("UC1DCedRgGHBdm81E1llLhOQ"), Some(443305053)),
    VTuber::new("pph", Some("UC1pR2ig6NhndhvicEgclNdA"), Some(393940396)),
    VTuber::new("roboco", Some("UCDqI2jOz0weumE8s7paEk6g"), Some(20813493)),
    VTuber::new("rushia", Some("UCl_gCybOJRIgOXw6Qb4qJzQ"), Some(443300418)),
    VTuber::new("shion", Some("UCXTpFs_3PqI41qX2d9tL2Rw"), Some(389857640)),
    VTuber::new("sora", Some("UCp6993wxpyDPHUpavwDFqgg"), Some(286179206)),
    VTuber::new("subaru", Some("UCvzGlP9oQwU--Y0r9id_jnA"), Some(389859190)),
    VTuber::new("suisei", Some("UC5CwaMl1eIgY8h02uZw7u8A"), Some(9034870)),
    VTuber::new("tamaki", Some("UC8NZiqKx6fsDT3AVcMiVFyA"), Some(12362451)),
    VTuber::new("ui", Some("UCt30jJgChL8qeT9VPadidSw"), Some(2601367)),
    VTuber::new("yogiri", None, Some(427061218)),
    VTuber::new("civia", None, Some(354411419)),
    VTuber::new("echo", None, Some(456368455)),
];
