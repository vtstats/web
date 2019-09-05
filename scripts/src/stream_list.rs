mod consts;
mod types;
mod utils;

use chrono::Utc;
use consts::VTUBERS;
use futures::future::try_join_all;
use isahc::{config::RedirectPolicy, prelude::*};
use url::Url;

use crate::types::{Error, Result, Values};
use crate::utils::{youtube_videos_snippet, Database};

fn main() -> Result<()> {
    futures::executor::block_on(real_main())
}

async fn real_main() -> Result<()> {
    let mut db = Database::new().await?;

    let now = Utc::now();
    let now_str = now.timestamp().to_string();

    let video_ids = try_join_all(
        VTUBERS
            .iter()
            .map(|v| fetch_video_from_feed(v.youtube, &now_str)),
    )
    .await?;

    let videos = youtube_videos_snippet(video_ids.join(",")).await?;

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

    db.patch_values(values).await?;

    let current = match db.current_streams().await {
        Ok(current) => current,
        Err(Error::Json(_)) => return Ok(()),
        Err(e) => return Err(e),
    };

    let mut values = Values::default();

    for (key, value) in &current {
        if !value {
            values.insert(format!("/streams/_current/{}", key), ());
        }
    }

    let vec = db
        .stream_stats(current.keys().map(|s| s.as_str()).collect::<Vec<_>>())
        .await?;

    for (id, avg, max) in vec {
        values.insert(format!("/streams/{}/maxViewers", id), max);
        values.insert(format!("/streams/{}/avgViewers", id), avg);
    }

    db.patch_values(values).await
}

async fn fetch_video_from_feed(channel: &str, now_str: &str) -> Result<String> {
    // try to fetch the lastest rss feed by disabling http cache and appending random query string
    let mut res = Request::get(
        Url::parse_with_params(
            "https://youtube.com/feeds/videos.xml",
            &[("channel_id", channel), ("_", now_str)],
        )?
        .as_str(),
    )
    .header("Cache-Control", "no-cache")
    .redirect_policy(RedirectPolicy::Follow)
    .body(())?
    .send_async()
    .await?;

    let text = res.text_async().await?;

    if let Some(line) = text.lines().nth(14) {
        let line = line.trim();
        // <yt:videoId>XXXXXXXXXXX</yt:videoId>
        if line.len() == 36 {
            Ok(String::from(&line[12..23]))
        } else {
            Ok(String::new())
        }
    } else {
        Ok(String::new())
    }
}
