use anyhow::Result;
use chrono::Utc;
use futures::{stream, StreamExt, TryStreamExt};
use holostats_config::CONFIG;
use holostats_database::{
    stream::{StreamStatus as StreamStatus_, UpsertYouTubeStreamQuery},
    Database,
};
use holostats_request::{RequestHub, StreamStatus};
use tracing::{field::Empty, Instrument, Span};

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = holostats_tracing::init("rss_refresh", false);

    let fut = async {
        if let Err(err) = real_main().await {
            Span::current().record("otel.status_code", &"ERROR");
            tracing::error!("Failed to refresh rss: {:?}", err);
        }
    };

    let span = tracing::info_span!(
        "rss_refresh",
        service.name = "holostats-cron",
        span.kind = "consumer",
        otel.status_code = Empty
    );

    fut.instrument(span).await;

    Ok(())
}

async fn real_main() -> Result<()> {
    let hub = RequestHub::new();

    let now_str = Utc::now().to_string();

    let fetches = CONFIG
        .vtubers
        .iter()
        .filter_map(|vtb| vtb.youtube.as_ref())
        .map(|id| hub.fetch_rss_feed(id, &now_str));

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

    tracing::debug!("Missing video ids: {:?}", missing_video_ids);

    let streams = hub.youtube_streams(&missing_video_ids).await?;

    if streams.is_empty() {
        tracing::debug!("Stream not found, ids={:?}", missing_video_ids);
        return Ok(());
    }

    for stream in streams {
        let vtuber_id = match CONFIG.find_by_youtube_channel_id(&stream.channel_id) {
            Some(vtuber) => &vtuber.id,
            None => continue,
        };

        let thumbnail_url = hub.upload_thumbnail(&stream.id).await;

        UpsertYouTubeStreamQuery {
            stream_id: &stream.id,
            vtuber_id,
            title: &stream.title,
            status: match stream.status {
                StreamStatus::Ended => StreamStatus_::Ended,
                StreamStatus::Live => StreamStatus_::Live,
                StreamStatus::Scheduled => StreamStatus_::Scheduled,
            },
            thumbnail_url,
            schedule_time: stream.schedule_time,
            start_time: stream.start_time,
            end_time: stream.end_time,
        }
        .execute(&db.pool)
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
