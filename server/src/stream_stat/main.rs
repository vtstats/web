#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../vtubers.rs"]
mod vtubers;

use chrono::{Timelike, Utc};
use reqwest::Client;
use sqlx::PgPool;
use std::env;
use std::str::FromStr;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let client = Client::new();

    let pool = PgPool::new(&env::var("DATABASE_URL").unwrap()).await?;

    let rows = sqlx::query!(
        r#"
            select stream_id
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
    .fetch_all(&pool)
    .await?;

    if rows.is_empty() {
        return Ok(());
    }

    let ids = rows
        .iter()
        .map(|row| row.stream_id.as_str())
        .collect::<Vec<_>>();

    let now = Utc::now();

    let streams = crate::requests::youtube_streams(
        &client,
        &ids,
        if now.hour() % 2 == 0 {
            env!("YOUTUBE_API_KEY0")
        } else {
            env!("YOUTUBE_API_KEY1")
        },
    )
    .await?;

    for id in ids
        .iter()
        .filter(|&id| !streams.iter().any(|stream| &stream.id == id))
    {
        let _ = sqlx::query!(
            r#"
                update youtube_streams
                   set end_time = $1
                 where stream_id = $2
            "#,
            now,
            id,
        )
        .execute(&pool)
        .await?;
    }

    for stream in &streams {
        let _ = sqlx::query!(
            r#"
                update youtube_streams
                   set (updated_at, schedule_time, start_time, end_time)
                     = ($1, $2, $3, $4)
                 where stream_id = $5
            "#,
            now,
            stream.schedule_time,
            stream.start_time,
            stream.end_time,
            stream.id,
        )
        .execute(&pool)
        .await?;

        if let Some(viewers) = &stream.viewers {
            let _ = sqlx::query!(
                r#"
                    insert into youtube_stream_viewer_statistic (stream_id, time, value)
                         values ($1, $2, $3)
                "#,
                stream.id,
                now,
                i32::from_str(&viewers).unwrap(),
            )
            .execute(&pool)
            .await?;
        }
    }

    println!(
        "Total: {} Skipped: {} Uppdated: {}",
        ids.len(),
        ids.len() - streams.len(),
        streams.len()
    );

    Ok(())
}
