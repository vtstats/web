#![allow(dead_code)]

mod channels;
mod pubsub;
mod rss;
mod streams;
mod thumbnail;
mod upload;

use chrono::{Timelike, Utc};
use reqwest::Client;

use crate::config::CONFIG;

pub use channels::Channel;
pub use streams::Stream;

#[derive(Clone)]
pub struct RequestHub {
    client: Client,
}

impl RequestHub {
    pub fn new() -> Self {
        RequestHub {
            client: Client::new(),
        }
    }

    pub fn youtube_api_key(&self) -> &str {
        let len = CONFIG.youtube.api_keys.len();
        let idx = (Utc::now().hour() as usize) % len;
        &CONFIG.youtube.api_keys[idx]
    }
}
