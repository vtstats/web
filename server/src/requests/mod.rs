#![allow(dead_code)]

mod channels;
mod pubsub;
mod rss;
mod streams;
mod thumbnail;
mod upload;

use chrono::{Timelike, Utc};
use reqwest::Client;
use std::env::var;

pub use channels::Channel;
pub use streams::Stream;

#[derive(Clone)]
pub struct RequestHub {
    client: Client,

    youtube_api_keys: Vec<String>,
    bilibili_cookie: String,

    s3_host: String,
    s3_access_key: String,
    s3_key_id: String,
    s3_region: String,

    s3_public_url: String,

    pubsub_url: String,
}

impl RequestHub {
    pub fn new() -> Self {
        let pubsub_url = format!(
            "{}/api/pubsub/{}",
            var("HOSTNAME").unwrap(),
            var("PUBSUB_PATH").unwrap()
        );

        RequestHub {
            client: Client::new(),

            youtube_api_keys: var("YOUTUBE_API_KEYS")
                .unwrap()
                .split(',')
                .map(Into::into)
                .collect::<Vec<String>>(),

            bilibili_cookie: var("BILIBILI_COOKIE").unwrap(),

            s3_host: var("S3_HOST").unwrap(),
            s3_access_key: var("S3_ACCESS_KEY").unwrap(),
            s3_key_id: var("S3_KEY_ID").unwrap(),
            s3_region: var("S3_REGION").unwrap(),

            s3_public_url: var("S3_PUBLIC_URL").unwrap(),

            pubsub_url,
        }
    }

    pub fn youtube_api_key(&self) -> &str {
        let len = self.youtube_api_keys.len();
        let idx = (Utc::now().hour() as usize) % len;
        &self.youtube_api_keys[idx]
    }
}
