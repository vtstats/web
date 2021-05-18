#[path = "../config.rs"]
mod config;
#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;

use chrono::Utc;
use futures::{stream, StreamExt, TryStreamExt};
use sqlx::PgPool;
use tracing::instrument;

use crate::config::CONFIG;
use crate::error::{Error, Result};
use crate::requests::{RequestHub, Stream};
use crate::utils::json;

#[tokio::main]
async fn main() -> Result<()> {
    utils::init_logger();

    let _guard = utils::init_tracing("rss_refresh", false);

    real_main().await
}

#[instrument(
    name = "rss_refresh"
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

    let pool = PgPool::connect(&CONFIG.database.url).await?;

    let feeds = stream::iter(fetches)
        .buffer_unordered(10)
        .try_collect::<Vec<String>>()
        .await?;

    let video_ids = feeds
        .iter()
        .filter_map(|feed| find_video_id(feed))
        .collect::<Vec<_>>();

    let missing_video_ids = find_missing_video_id(&pool, &video_ids).await?;

    if missing_video_ids.is_empty() {
        return Ok(());
    }

    let streams = hub.youtube_streams(&missing_video_ids).await?;

    if streams.is_empty() {
        tracing::error!(err.msg = "stream not found");
        return Ok(());
    }

    for stream in streams {
        let thumbnail_url = hub.upload_thumbnail(&stream.id).await;

        let vtuber = CONFIG.find_by_youtube_channel_id(&stream.channel_id);

        match vtuber {
            Some(vtb) => {
                update_youtube_stream(&stream, &vtb.id, thumbnail_url, &pool).await?;
            }
            _ => {
                tracing::error!(
                    err.msg = "vtuber not found",
                    channel_id = &*stream.channel_id
                );
            }
        }
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

#[instrument(
    name = "Find missing video ids",
    skip(pool, video_ids),
    fields(db.table = "youtube_streams")
)]
async fn find_missing_video_id(pool: &PgPool, video_ids: &[String]) -> Result<Vec<String>> {
    let rows = sqlx::query!(
        r#"
            select id
              from unnest($1::text[]) as id
             where not exists
                   (
                     select stream_id
                     from youtube_streams
                     where stream_id = id
                   )
        "#,
        video_ids
    )
    .fetch_all(pool)
    .await?;

    let ids = rows
        .into_iter()
        .filter_map(|row| row.id)
        .collect::<Vec<_>>();

    tracing::info!(video_ids = json(&ids));

    Ok(ids)
}

#[instrument(
    name = "Update youtube stream",
    skip(stream, vtuber_id, thumbnail_url, pool),
    fields(db.table = "youtube_streams")
)]
async fn update_youtube_stream(
    stream: &Stream,
    vtuber_id: &str,
    thumbnail_url: Option<String>,
    pool: &PgPool,
) -> Result<()> {
    let _ = sqlx::query!(
        r#"
            insert into youtube_streams (stream_id, vtuber_id, title, status, thumbnail_url, schedule_time, start_time, end_time)
                 values ($1, $2, $3, $4, $5, $6, $7, $8)
            on conflict (stream_id) do update
                    set (title, status, thumbnail_url, schedule_time, start_time, end_time)
                      = ($3, $4, coalesce($5, youtube_streams.thumbnail_url), $6, $7, $8)
        "#,
        stream.id,
        vtuber_id,
        stream.title,
        stream.status: _,
        thumbnail_url,
        stream.schedule_time,
        stream.start_time,
        stream.end_time,
    )
    .execute(pool)
    .await
    .map_err(Error::Database)?;

    Ok(())
}
