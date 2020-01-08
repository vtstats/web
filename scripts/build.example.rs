use std::fs::File;
use std::io::Write;

use serde_json::Value;

fn main() {
    let value: Value = serde_json::from_str(include_str!("../vtubers.json")).unwrap();
    let mut f = File::create("./src/consts.rs").unwrap();

    writeln!(
        f,
        "#![allow(clippy::unreadable_literal)]
#![allow(dead_code)]

#[derive(Debug)]
pub struct VTuber {{
    pub name: &'static str,
    pub youtube: Option<&'static str>,
    pub bilibili: Option<usize>,
}}

pub const VTUBERS: &[VTuber] = &["
    )
    .unwrap();

    for item in value["items"].as_array().unwrap() {
        for vtuber in item["members"].as_array().unwrap() {
            writeln!(f, "    VTuber {{").unwrap();
            writeln!(f, "        name: \"{}\",", vtuber["id"].as_str().unwrap()).unwrap();
            if vtuber["youtube"].is_null() {
                writeln!(f, "        youtube: None,",).unwrap();
            } else {
                writeln!(
                    f,
                    "        youtube: Some(\"{}\"),",
                    vtuber["youtube"].as_str().unwrap(),
                )
                .unwrap();
            }

            if vtuber["bilibili"].is_null() {
                writeln!(f, "        bilibili: None,",).unwrap();
            } else {
                writeln!(
                    f,
                    "        bilibili: Some({}),",
                    vtuber["bilibili"].as_u64().unwrap(),
                )
                .unwrap();
            }

            writeln!(f, "    }},").unwrap();
        }
    }

    writeln!(f, "];").unwrap();

    println!("cargo:rustc-env=YOUTUBE_API_KEY0=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    println!("cargo:rustc-env=YOUTUBE_API_KEY1=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

    println!("cargo:rustc-env=FIREBASE_PROJECT_ID=XXXXXXXXX");
    println!("cargo:rustc-env=FIREBASE_WEB_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

    println!("cargo:rustc-env=FIREBASE_USER_EMAIL=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    println!("cargo:rustc-env=FIREBASE_USER_PASSWORD=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
}
