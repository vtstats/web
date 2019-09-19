mod consts;
mod types;
mod utils;

use chrono::Utc;
use isahc::HttpClient;
use std::str::FromStr;

use crate::types::{Error, Result, Values};
use crate::utils::{current_streams, patch_values, youtube_videos, Auth};

#[tokio::main]
async fn main() -> Result<()> {
    let client = HttpClient::new()?;

    let auth = Auth::new(&client).await?;

    let streams = match current_streams(&client, &auth.id_token).await {
        Ok(streams) => streams,
        Err(Error::Json(_)) => return Ok(()),
        Err(e) => return Err(e),
    };

    let now = Utc::now();
    let now_timestamp = now.timestamp();

    let ids = streams
        .into_iter()
        .filter(|&(_, v)| v)
        .map(|(k, _)| k)
        .collect::<Vec<_>>();

    let videos = youtube_videos(&client, ids.join(",")).await?;

    let mut values = Values::default();

    for id in ids {
        if let Some(video) = videos.iter().find(|v| v.id == id) {
            if let Some(details) = &video.live_streaming_details {
                if let Some(end) = &details.actual_end_time {
                    values.insert(format!("/streams/_current/{}", id), false);
                    values.insert(format!("/streams/{}/end", id), end.clone());
                } else if let Some(current) = &details.concurrent_viewers {
                    let current = usize::from_str(&current)?;
                    values.insert(format!("/streamStats/{}/{}", id, now_timestamp), current);
                }
            }
        } else {
            // video becomes private or something elese
            values.insert(format!("/streams/_current/{}", id), false);
            values.insert(format!("/streams/{}/end", id), now);
        }
    }

    values.insert("/updatedAt/streamStat", now);

    patch_values(&client, &auth.id_token, values).await
}
