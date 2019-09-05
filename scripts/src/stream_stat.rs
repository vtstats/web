mod consts;
mod types;
mod utils;

use chrono::Utc;
use std::str::FromStr;

use crate::types::{Error, Result, Values};
use crate::utils::{youtube_videos, Database};

fn main() -> Result<()> {
    futures::executor::block_on(real_main())
}

async fn real_main() -> Result<()> {
    let mut db = Database::new().await?;

    let streams = match db.current_streams().await {
        Ok(streams) => streams,
        Err(Error::Json(_)) => return Ok(()),
        Err(e) => return Err(e),
    };

    let now = Utc::now();
    let now_timestamp = now.timestamp();

    let ids = streams
        .iter()
        .filter(|&(_, v)| *v)
        .map(|(k, _)| k.as_str())
        .collect::<Vec<_>>();

    let videos = youtube_videos(ids.join(",")).await?;

    let mut values = Values::default();

    for id in ids {
        if let Some(video) = videos.iter().find(|v| v.id == *id) {
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

    db.patch_values(values).await
}
