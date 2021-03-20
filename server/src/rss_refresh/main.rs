#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;
#[path = "../vtubers.rs"]
mod vtubers;

use reqwest::Client;
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use std::env;
use tracing::instrument;

use crate::error::{Error, Result};
use crate::requests::{upload_file, youtube_streams, youtube_thumbnail, Stream};
use crate::utils::json;
use crate::vtubers::{VTuber, VTUBERS};

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
    let channel_ids = VTUBERS.iter().filter_map(|vtb| vtb.youtube);

    let client = Client::new();

    let pool = PgPool::connect(&env::var("DATABASE_URL").unwrap()).await?;

    let feeds = requests::rss::fetch_feeds(&client, channel_ids).await?;

    let video_ids = feeds
        .iter()
        .filter_map(|feed| find_video_id(feed))
        .collect::<Vec<_>>();

    let missing_video_ids = find_missing_video_id(&pool, &video_ids).await?;

    if missing_video_ids.is_empty() {
        return Ok(());
    }

    let streams = youtube_streams(&client, &missing_video_ids).await?;

    if streams.is_empty() {
        tracing::error!(err.msg = "stream not found");
        return Ok(());
    }

    for stream in streams {
        let thumbnail_url = upload_thumbnail(&stream.id, &client)
            .await
            .map(|filename| format!("https://taiwanv.linnil1.me/thumbnail/{}", filename));

        let vtuber = VTuber::find_by_youtube_channel_id(&stream.channel_id);

        match vtuber {
            Some(vtb) => {
                update_youtube_stream(&stream, vtb.id, thumbnail_url, &pool).await?;
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
    if let Some(line) = feed.lines().nth(14) {
        let line = line.trim();
        // <yt:videoId>XXXXXXXXXXX</yt:videoId>
        if line.starts_with("<yt:videoId>") && line.ends_with("</yt:videoId>") {
            let id = &line["<yt:videoId>".len()..(line.len() - "</yt:videoId>".len())];

            return Some(id.into());
        }
    }

    None
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

async fn upload_thumbnail(stream_id: &str, client: &Client) -> Option<String> {
    let data = match youtube_thumbnail(stream_id, &client).await {
        Ok(x) => x,
        Err(e) => {
            tracing::warn!(err = ?e, err.msg = "failed to upload thumbnail");
            return None;
        }
    };

    let content_sha256 = Sha256::digest(data.as_ref());

    let filename = format!("{}.{}.jpg", stream_id, hex::encode(content_sha256));

    match upload_file(&filename, data, "image/jpg", &client).await {
        Ok(_) => Some(filename),
        Err(e) => {
            tracing::warn!(err = ?e, err.msg = "failed to upload thumbnail");
            None
        }
    }
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
