mod consts;
mod types;
mod utils;

use chrono::{Timelike, Utc};
use isahc::HttpClient;
use std::collections::HashMap;
use std::fs::{self, File};
use std::str::FromStr;

use crate::types::{Result, Values};
use crate::utils::{patch_values, schedule_streams, youtube_videos, Auth};

const JSON_PATH: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/.youtube_stream.json");

#[tokio::main]
async fn main() -> Result<()> {
    let client = HttpClient::new()?;

    let auth = Auth::new(&client).await?;

    let mut videos_stats: HashMap<String, Vec<usize>> =
        serde_json::from_str(&fs::read_to_string(JSON_PATH)?)?;

    let schedule_streams = schedule_streams(&client).await?;

    let mut video_ids = schedule_streams
        .iter()
        .chain(videos_stats.keys())
        .map(|x| x.as_str())
        .collect::<Vec<_>>();

    video_ids.dedup();

    if video_ids.is_empty() {
        return Ok(());
    }

    let mut values = Values::default();

    let now = Utc::now();
    let now_str = now.timestamp().to_string();

    values.insert("/updatedAt/streams", now);

    let videos = youtube_videos(
        &client,
        &video_ids.join(","),
        if now.hour() % 2 == 0 {
            env!("YOUTUBE_API_KEY0")
        } else {
            env!("YOUTUBE_API_KEY1")
        },
    )
    .await?;

    for video in videos {
        if let Some(details) = video.live_streaming_details {
            if let Some(start) = &details.actual_start_time {
                values.insert(format!("/streams/{}/schedule", video.id), ());
                values.insert(format!("/streams/{}/start", video.id), start.clone());
                values.insert(format!("/streams/{}/status", video.id), "live");
            }

            if let Some(end) = &details.actual_end_time {
                values.insert(format!("/streams/{}/end", video.id), end.clone());
                values.insert(format!("/streams/{}/status", video.id), "end");

                videos_stats.remove(&video.id);
            }

            // only track the number of viewers when stream is live
            if details.actual_start_time.is_some() && details.actual_end_time.is_none() {
                if let Some(current) = &details.concurrent_viewers {
                    let current = usize::from_str(&current)?;

                    values.insert(format!("/streamStats/{}/{}", video.id, now_str), current);

                    // should be fixed by nll in the future
                    if let Some(viewers) = videos_stats.get_mut(&video.id) {
                        viewers.push(current);

                        values.insert(
                            format!("/streams/{}/maxViewers", video.id),
                            *(viewers.iter().max().unwrap()),
                        );

                        values.insert(
                            format!("/streams/{}/avgViewers", video.id),
                            viewers.iter().sum::<usize>() / viewers.len(),
                        );
                    } else {
                        videos_stats.insert(video.id.clone(), vec![current]);

                        values.insert(format!("/streams/{}/maxViewers", video.id), current);
                        values.insert(format!("/streams/{}/avgViewers", video.id), current);
                    }
                }
            }
        }
    }

    serde_json::to_writer(File::create(JSON_PATH)?, &videos_stats)?;

    patch_values(&client, &auth.id_token, values).await?;

    Ok(())
}
