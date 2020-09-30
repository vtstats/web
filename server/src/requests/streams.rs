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

pub async fn youtube_streams(client: &Client, ids: &[&str], key: &str) -> Result<Vec<Video>> {
    let mut streams = vec![];

    // youtube limits 50 streams per request
    for chunk in ids.chunks(50) {
        let url = Url::parse_with_params(
            "https://www.googleapis.com/youtube/v3/videos",
            &[
                ("part", "id,liveStreamingDetails"),
                ("fields", "items(id,liveStreamingDetails(actualStartTime,actualEndTime,scheduledStartTime,concurrentViewers))"),
                ("maxResults", "50"),
                ("key", key),
                ("id", chunk.join(",").as_str()),
            ],
        )?;

        let mut res = client
            .get(url)
            .send()
            .await?
            .json::<VideosListResponse>()
            .await?;

        streams.append(&mut res.items);
    }

    Ok(streams)
}
