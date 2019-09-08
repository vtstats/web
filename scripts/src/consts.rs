#![allow(clippy::unreadable_literal)]
#![allow(dead_code)]

#[derive(Debug)]
pub struct VTuber {
    pub name: &'static str,
    pub youtube: &'static str,
    pub bilibili: usize,
}

impl VTuber {
    const fn new(name: &'static str, youtube: &'static str, bilibili: usize) -> Self {
        VTuber {
            name,
            youtube,
            bilibili,
        }
    }
}

pub const VTUBERS: [VTuber; 44] = [
    VTuber::new("ai", "UC4YaOt1yT-ZeyB0OmxHgolA", 1473830),
    VTuber::new("aki", "UCFTLzh12_nrtzqBPsTCqenA", 389857131),
    VTuber::new("aqua", "UC1opHUrw8rvnsadT-iGp7Cg", 375504219),
    VTuber::new("ayame", "UC7fk0CB07ly8oSl0aqKkqFg", 389858027),
    VTuber::new("azki", "UC0TXe_LYZ4scaW2XMyi5_kw", 389056211),
    VTuber::new("choco", "UC1suqwovbL1kzsoaZgFZLKg", 389858754),
    VTuber::new("flare", "UCvInZx9h3jC2JzsIzoOebWg", 454737600),
    VTuber::new("fubuki", "UCdn5BQ06XqgXoAxIhbqw5Rg", 332704117),
    VTuber::new("haato", "UC1CfXB_kRs3C-zaeTG3oGyg", 339567211),
    VTuber::new("haneru", "UC0Owc36U9lOyi9Gx9Ic-4qg", 382545233),
    VTuber::new("hareru", "UCyIcOCH-VWaRKH9IkR8hz7Q", 441381282),
    VTuber::new("hitona", "UCV2m2UifDGr3ebjSnDv5rUA", 441382432),
    VTuber::new("hololive", "UCJFZiqLMntJufDCHc6bQixg", 286700005),
    VTuber::new("kano", "UCfuz6xYbYFGsWWBi3SpJI1w", 316381099),
    VTuber::new("korone", "UChAnqc_AY5_I3Px5dig3X1Q", 412135619),
    VTuber::new("kuma", "UCCNXAA3Ik_csiCkTG9ixUhg", 12920215),
    VTuber::new("luna", "UCQYADFw7xEJ9oZSM5ZbqyBw", 265224956),
    VTuber::new("marine", "UCCzUftO8KOVkV4wQG1vkUvg", 454955503),
    VTuber::new("matsuri", "UCQ0UDLQCjY0rmuxCDE38FGg", 336731767),
    VTuber::new("mea", "UCWCc8tO-uUl_7SJXIKJACMw", 349991143),
    VTuber::new("mel", "UCD8HOxPs4Xvsm8H0ZxXGiBw", 389856447),
    VTuber::new("miko", "UC-hM6YJuNYVAmUWxeIr9FeA", 366690056),
    VTuber::new("mio", "UCp-5t9SrOQwXMU7iIjQfARg", 389862071),
    VTuber::new("miu", "UChN7P9OhRltW3w9IesC92PA", 2778044),
    VTuber::new("nana", "UCbfv8uuUXt3RSJGEwxny5Rw", 386900246),
    VTuber::new("nekomiya", "UCevD0wKzJFpfIkvHOiQsfLQ", 291296062),
    VTuber::new("nobuhime", "UCGcD5iUDG8xiywZeeDxye-A", 80387576),
    VTuber::new("noel", "UCdyqAaZDKHXg4Ahi7VENThQ", 454733056),
    VTuber::new("nonono", "UCiexEBp7-D46FXUtQ-BpgWg", 441403698),
    VTuber::new("okayu", "UCvaTdHTWBGv3MKj3KVqJVCw", 412135222),
    VTuber::new("overidea", "UCupCAZz1l52vV8m-dvaoBVQ", 18149131),
    VTuber::new("paryi", "UCrhx4PaF3uIo9mDcTxHnmIg", 1576121),
    VTuber::new("pekora", "UC1DCedRgGHBdm81E1llLhOQ", 443305053),
    VTuber::new("pph", "UC1pR2ig6NhndhvicEgclNdA", 393940396),
    VTuber::new("ritsu", "UCL9dLCVvHyMiqjp2RDgowqQ", 6055289),
    VTuber::new("roboco", "UCDqI2jOz0weumE8s7paEk6g", 20813493),
    VTuber::new("rushia", "UCl_gCybOJRIgOXw6Qb4qJzQ", 443300418),
    VTuber::new("serena", "UCRXBTd80F5IIWWY4HatJ5Ug", 380829248),
    VTuber::new("shion", "UCXTpFs_3PqI41qX2d9tL2Rw", 389857640),
    VTuber::new("sora", "UCp6993wxpyDPHUpavwDFqgg", 286179206),
    VTuber::new("subaru", "UCvzGlP9oQwU--Y0r9id_jnA", 389859190),
    VTuber::new("suisei", "UC5CwaMl1eIgY8h02uZw7u8A", 9034870),
    VTuber::new("tamaki", "UC8NZiqKx6fsDT3AVcMiVFyA", 12362451),
    VTuber::new("ui", "UCt30jJgChL8qeT9VPadidSw", 2601367),
];
