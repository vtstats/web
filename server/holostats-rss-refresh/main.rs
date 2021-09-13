use anyhow::Result;
use chrono::Utc;
use futures::{stream, StreamExt, TryStreamExt};
use holostats_config::CONFIG;
use holostats_database::{streams::StreamStatus as StreamStatus_, Database};
use holostats_request::{RequestHub, StreamStatus};
use holostats_utils::tracing::init;
use tracing::instrument;

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = init("rss_refresh", false);

    real_main().await
}

#[instrument(
    name = "rss_refresh"
    span.kind = "consumer"
    fields(service.name = "holostats-cron")
)]
async fn real_main() -> Result<()> {
    let hub = RequestHub::new();

    let now_str = Utc::now().to_string();

    let fetches = CONFIG
        .vtubers
        .iter()
        .filter_map(|vtb| vtb.youtube.as_ref())
        .map(|id| hub.fetch_rss_feed(&id, &now_str));

    let db = Database::new().await?;

    let feeds = stream::iter(fetches)
        .buffer_unordered(10)
        .try_collect::<Vec<String>>()
        .await?;

    let video_ids = feeds
        .iter()
        .filter_map(|feed| find_video_id(feed))
        .collect::<Vec<_>>();

    let missing_video_ids = db.find_missing_video_id(&video_ids).await?;

    if missing_video_ids.is_empty() {
        return Ok(());
    }

    let streams = hub.youtube_streams(&missing_video_ids).await?;

    if streams.is_empty() {
        tracing::error!(err.msg = "stream not found");
        return Ok(());
    }

    for stream in streams {
        let vtuber_id = match CONFIG.find_by_youtube_channel_id(&stream.channel_id) {
            Some(vtuber) => &vtuber.id,
            None => continue,
        };

        let thumbnail_url = hub.upload_thumbnail(&stream.id).await;

        db.upsert_youtube_stream(
            stream.id,
            &vtuber_id,
            stream.title,
            match stream.status {
                StreamStatus::Ended => StreamStatus_::Ended,
                StreamStatus::Live => StreamStatus_::Live,
                StreamStatus::Scheduled => StreamStatus_::Scheduled,
            },
            thumbnail_url,
            stream.schedule_time,
            stream.start_time,
            stream.end_time,
        )
        .await?;
    }

    Ok(())
}

fn find_video_id(feed: &str) -> Option<String> {
    feed.lines()
        .nth(14)
        // <yt:videoId>XXXXXXXXXXX</yt:videoId>
        .map(|s| s.trim())
        .and_then(|s| s.strip_prefix("<yt:videoId>"))
        .and_then(|s| s.strip_suffix("</yt:videoId>"))
        .map(Into::into)
}
