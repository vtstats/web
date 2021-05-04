#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;
#[path = "../vtubers.rs"]
mod vtubers;

use chrono::{DateTime, Utc};
use dotenv::dotenv;
use sqlx::PgPool;
use std::env;
use tracing::instrument;

use crate::error::Result;
use crate::requests::{RequestHub, Stream};

#[tokio::main]
async fn main() -> Result<()> {
    utils::init_logger();

    let _guard = utils::init_tracing("stream_stat", false);

    real_main().await
}

#[instrument(
    name = "stream_stat"
    fields(service.name = "holostats-cron"),
)]
async fn real_main() -> Result<()> {
    dotenv().expect("Failed to load .env file");

    let hub = RequestHub::new();

    let pool = PgPool::connect(&env::var("DATABASE_URL").unwrap()).await?;

    let ids = select_interest_streams(&pool).await?;

    if ids.is_empty() {
        return Ok(());
    }

    let streams = hub.youtube_streams(&ids).await?;

    let now = Utc::now();

    let offline_ids = ids
        .iter()
        .filter(|&id| !streams.iter().any(|stream| &stream.id == id))
        .collect::<Vec<_>>();

    if !offline_ids.is_empty() {
        terminate_stream(&offline_ids, now, &pool).await?;
    }

    update_youtube_streams(&streams, now, &pool).await?;
    update_youtube_stream_viewer_statistic(&streams, now, &pool).await?;

    Ok(())
}

#[instrument(
    name = "Select interest streams",
    skip(pool),
    fields(db.table = "youtube_streams"),
)]
async fn select_interest_streams(pool: &PgPool) -> Result<Vec<String>> {
    let rows = sqlx::query!(
        r#"
            select stream_id as id
              from youtube_streams
             where end_time IS NULL
               and (
                     start_time is not null or (
                       schedule_time > now() - interval '6 hours'
                       and schedule_time < now() + interval '5 minutes'
                     )
                   )
        "#
    )
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(|row| row.id).collect::<Vec<_>>())
}

#[instrument(
    name = "Terminate offline YouTube streams",
    skip(now, pool),
    fields(db.table = "youtube_streams", ?ids),
)]
async fn terminate_stream(ids: &[&String], now: DateTime<Utc>, pool: &PgPool) -> Result<()> {
    let mut tx = pool.begin().await?;

    for id in ids {
        let _ = sqlx::query!(
            r#"
                update youtube_streams
                   set end_time = $1
                 where stream_id = $2
            "#,
            now,
            id,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(
    name = "Update YouTube Streams",
    skip(streams, now, pool),
    fields(db.table = "youtube_streams"),
)]
async fn update_youtube_streams(
    streams: &[Stream],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for stream in streams.iter() {
        let _ = sqlx::query!(
            r#"
                update youtube_streams
                   set (updated_at, status, schedule_time, start_time, end_time)
                     = ($1, $2, $3, $4, $5)
                 where stream_id = $6
            "#,
            now,
            stream.status: _,
            stream.schedule_time,
            stream.start_time,
            stream.end_time,
            stream.id,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(
    name = "Update YouTube stream viewer statistic",
    skip(streams, now, pool),
    fields(db.table = "youtube_stream_viewer_statistic"),
)]
async fn update_youtube_stream_viewer_statistic(
    streams: &[Stream],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for stream in streams.iter() {
        if let Some(viewers) = stream.viewers {
            let _ = sqlx::query!(
                r#"
                    insert into youtube_stream_viewer_statistic (stream_id, time, value)
                         values ($1, $2, $3)
                "#,
                stream.id,
                now,
                viewers,
            )
            .execute(&mut tx)
            .await?;
        }
    }

    tx.commit().await?;

    Ok(())
}
