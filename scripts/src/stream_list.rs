mod consts;
mod types;
mod utils;

use chrono::Utc;
use consts::VTUBERS;
use futures::future::try_join_all;
use isahc::{config::RedirectPolicy, HttpClient};
use std::time::Duration;

use crate::types::{Error, Result, Values};
use crate::utils::{
    auth, current_streams, patch_values, stream_stats, youtube_first_video, youtube_videos_snippet,
};

fn main() -> Result<()> {
    futures::executor::block_on(real_main())
}

async fn real_main() -> Result<()> {
    let client = HttpClient::builder()
        .redirect_policy(RedirectPolicy::Follow)
        .tcp_keepalive(Duration::from_secs(5))
        .build()?;

    let auth = auth(&client).await?;

    let now = Utc::now();
    let now_str = now.timestamp().to_string();

    let video_ids = try_join_all(
        VTUBERS
            .iter()
            .map(|v| youtube_first_video(&client, v.youtube, &now_str)),
    )
    .await?;

    let videos = youtube_videos_snippet(&client, video_ids.join(",")).await?;

    let mut values = Values::default();

    for video in videos {
        if let Some(detail) = video.live_streaming_details {
            if detail.actual_end_time.is_some() {
                continue;
            } else if let Some(start) = detail.actual_start_time {
                values.insert(format!("/streams/_current/{}", video.id), true);

                if let Some(snippet) = video.snippet {
                    if let Some(vtuber) = VTUBERS.iter().find(|v| v.youtube == snippet.channel_id) {
                        values.insert(format!("/streams/{}/vtuberId", video.id), vtuber.name);
                    }
                    values.insert(format!("/streams/{}/title", video.id), snippet.title);
                }

                values.insert(format!("/streams/{}/start", video.id), start);
                values.insert(format!("/streams/{}/id", video.id), video.id);
            }
        }
    }

    values.insert("/streams/_updatedAt", now);

    patch_values(&client, &auth.id_token, values).await?;

    let current = match current_streams(&client, &auth.id_token).await {
        Ok(current) => current,
        Err(Error::Json(_)) => return Ok(()),
        Err(e) => return Err(e),
    };

    let mut values = Values::default();

    for (key, _) in current.iter().filter(|&(_, v)| !v) {
        values.insert(format!("/streams/_current/{}", key), ());
    }

    let stats = try_join_all(
        current
            .keys()
            .map(|id| stream_stats(&client, &auth.id_token, id)),
    )
    .await?;

    for (id, stat) in current.keys().zip(stats.iter()) {
        if !stat.is_empty() {
            values.insert(
                format!("/streams/{}/maxViewers", id),
                *(stat.iter().max().unwrap()),
            );
            values.insert(
                format!("/streams/{}/avgViewers", id),
                stat.iter().sum::<usize>() / stat.len(),
            );
        }
    }

    patch_values(&client, &auth.id_token, values).await
}
