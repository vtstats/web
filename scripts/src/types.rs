#![allow(dead_code)]

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Debug)]
pub struct Values(HashMap<String, Value>);

#[derive(Serialize, Debug)]
#[serde(untagged)]
pub enum Value {
    Number(i32),
    String(String),
    Date(DateTime<Utc>),
    Bool(bool),
    Null,
}

impl From<()> for Value {
    fn from(_: ()) -> Self {
        Value::Null
    }
}

impl From<bool> for Value {
    fn from(value: bool) -> Self {
        Value::Bool(value)
    }
}

impl From<usize> for Value {
    fn from(value: usize) -> Self {
        Value::Number(value as i32)
    }
}

impl From<i32> for Value {
    fn from(value: i32) -> Self {
        Value::Number(value)
    }
}

impl From<String> for Value {
    fn from(value: String) -> Self {
        Value::String(value)
    }
}

impl From<&str> for Value {
    fn from(value: &str) -> Self {
        Value::String(value.into())
    }
}

impl From<DateTime<Utc>> for Value {
    fn from(value: DateTime<Utc>) -> Self {
        Value::Date(value)
    }
}

impl Default for Values {
    fn default() -> Self {
        Values(HashMap::new())
    }
}

impl Values {
    pub fn insert<K: Into<String>, V: Into<Value>>(&mut self, key: K, value: V) {
        self.0.insert(key.into(), value.into());
    }
}

#[derive(Debug)]
pub enum Error {
    Http(isahc::Error),
    Json(serde_json::Error),
    Url(url::ParseError),
    Io(std::io::Error),
    ParseInt(std::num::ParseIntError),
}

impl From<isahc::http::Error> for Error {
    fn from(err: isahc::http::Error) -> Self {
        Error::Http(err.into())
    }
}

impl From<isahc::Error> for Error {
    fn from(err: isahc::Error) -> Self {
        Error::Http(err)
    }
}

impl From<serde_json::Error> for Error {
    fn from(err: serde_json::Error) -> Self {
        Error::Json(err)
    }
}

impl From<url::ParseError> for Error {
    fn from(err: url::ParseError) -> Self {
        Error::Url(err)
    }
}

impl From<std::io::Error> for Error {
    fn from(err: std::io::Error) -> Self {
        Error::Io(err)
    }
}

impl From<std::num::ParseIntError> for Error {
    fn from(err: std::num::ParseIntError) -> Self {
        Error::ParseInt(err)
    }
}

pub type Result<T> = std::result::Result<T, Error>;

pub mod auth {
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct SignInRequest<'a> {
        pub email: &'a str,
        pub password: &'a str,
        pub return_secure_token: bool,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct SignInResponse {
        pub id_token: String,
        pub refresh_token: String,
        pub expires_in: String,
    }

    #[derive(Serialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct RefreshRequest<'a> {
        pub grant_type: &'a str,
        pub refresh_token: &'a str,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "snake_case")]
    pub struct RefreshResponse {
        pub id_token: String,
        pub refresh_token: String,
        pub expires_in: String,
    }
}

pub mod bilibili {
    use serde::Deserialize;

    #[derive(Deserialize)]
    pub struct Response<T> {
        pub data: T,
    }

    pub type UpstatResponse = Response<UpstatData>;

    #[derive(Deserialize)]
    pub struct UpstatData {
        pub archive: UpstatDataArchive,
    }

    #[derive(Deserialize)]
    pub struct UpstatDataArchive {
        pub view: i32,
    }

    pub type StatResponse = Response<StatData>;

    #[derive(Deserialize)]
    pub struct StatData {
        pub follower: i32,
    }
}

pub mod youtube {
    use serde::Deserialize;

    #[derive(Deserialize, Debug)]
    pub struct Response<T> {
        pub items: Vec<T>,
    }

    pub type ChannelsResponse = Response<Channel>;

    #[derive(Deserialize, Debug)]
    pub struct Channel {
        pub id: String,
        pub statistics: ChannelStatistics,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct ChannelStatistics {
        pub view_count: String,
        pub subscriber_count: String,
    }

    pub type VideosResponse = Response<Video>;

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct Video {
        pub id: String,
        pub snippet: Option<VideoSnippet>,
        pub live_streaming_details: Option<LiveStreamingDetails>,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct LiveStreamingDetails {
        pub actual_start_time: Option<String>,
        pub actual_end_time: Option<String>,
        pub scheduled_start_time: Option<String>,
        pub concurrent_viewers: Option<String>,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct VideoSnippet {
        pub channel_id: String,
        pub title: String,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct LiveChatMessagesResponse {
        pub items: Vec<LiveChatMessage>,
        pub next_page_token: String,
        pub polling_interval_millis: u64,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct LiveChatMessage {
        pub snippet: LiveChatMessageSnippet,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct LiveChatMessageSnippet {
        pub published_at: String,
        pub super_chat_details: Option<SuperChatDetails>,
    }

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct SuperChatDetails {
        pub amount_micros: String,
        pub currency: String,
        pub tier: usize,
    }
}

#[derive(Deserialize, Debug)]
pub struct ScheduleStream {
    pub streams: Vec<String>,
}
