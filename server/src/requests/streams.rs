#![allow(dead_code)]

use chrono::{DateTime, Utc};
use reqwest::{Client, Url};

use crate::error::Result;

#[derive(serde::Deserialize, Debug)]
pub struct VideosListResponse {
    pub items: Vec<Video>,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Video {
    pub id: String,
    pub live_streaming_details: Option<LiveStreamingDetails>,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LiveStreamingDetails {
    pub actual_start_time: Option<DateTime<Utc>>,
    pub actual_end_time: Option<DateTime<Utc>>,
    pub scheduled_start_time: Option<DateTime<Utc>>,
    pub concurrent_viewers: Option<String>,
}

pub async fn youtube_streams(
    client: &Client,
    ids: &[&str],
    key: &str,
) -> Result<VideosListResponse> {
    let url = Url::parse_with_params(
        "https://www.googleapis.com/youtube/v3/videos",
        &[
            ("part", "id,liveStreamingDetails"),
            ("fields", "items(id,liveStreamingDetails(actualStartTime,actualEndTime,scheduledStartTime,concurrentViewers))"),
            ("maxResults", "50"),
            ("key", key),
            ("id", ids.join(",").as_str()),
        ],
    )?;

    let res = client.get(url.as_str()).send().await?.json().await?;

    Ok(res)
}
