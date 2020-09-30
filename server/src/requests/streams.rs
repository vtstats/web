#![allow(dead_code)]

use chrono::{DateTime, Utc};
use futures::future::TryFutureExt;
use reqwest::{Client, Url};

use crate::error::Result;

pub struct Stream {
    pub id: String,
    pub start_time: Option<DateTime<Utc>>,
    pub end_time: Option<DateTime<Utc>>,
    pub schedule_time: Option<DateTime<Utc>>,
    pub viewers: Option<String>,
}

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

pub async fn youtube_streams(client: &Client, ids: &[&str], key: &str) -> Result<Vec<Stream>> {
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

        let res = client
            .get(url.clone())
            .send()
            .and_then(|res| res.json::<VideosListResponse>())
            .map_err(|err| (url, err))
            .await?;

        streams.extend(res.items.into_iter().filter_map(|stream| {
            if let Some(detail) = stream.live_streaming_details {
                Some(Stream {
                    id: stream.id,
                    start_time: detail.actual_start_time,
                    end_time: detail.actual_end_time,
                    schedule_time: detail.scheduled_start_time,
                    viewers: detail.concurrent_viewers,
                })
            } else {
                None
            }
        }));
    }

    Ok(streams)
}
