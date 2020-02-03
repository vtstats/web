mod consts;
mod error;
mod requests;

use chrono::{Timelike, Utc};
use sqlx::PgPool;
use std::str::FromStr;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let mut pool = PgPool::new(env!("DATABASE_URL")).await?;

    let rows = sqlx::query!(
        r#"
SELECT stream_id
FROM youtube_streams
WHERE end_time IS NULL AND (start_time IS NOT NULL OR schedule_time < 'now')
        "#
    )
    .fetch_all(&mut pool)
    .await?;

    let ids = rows
        .iter()
        .map(|row| row.stream_id.as_str())
        .collect::<Vec<_>>();

    if ids.is_empty() {
        return Ok(());
    }

    let now = Utc::now();

    let streams = crate::requests::youtube_streams(
        &reqwest::Client::new(),
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
        .filter(|&id| !streams.items.iter().any(|stream| &stream.id == id))
    {
        let _ = sqlx::query!(
            "UPDATE youtube_streams SET end_time = $1 WHERE stream_id = $2",
            now,
            id.to_string()
        )
        .execute(&mut pool)
        .await?;
    }

    for stream in &streams.items {
        if let Some(details) = &stream.live_streaming_details {
            if let Some(schedule) = details.scheduled_start_time {
                let _ = sqlx::query!(
                    "UPDATE youtube_streams SET schedule_time = $1 WHERE stream_id = $2",
                    schedule,
                    stream.id
                )
                .execute(&mut pool)
                .await?;
            }

            if let Some(start) = details.actual_start_time {
                let _ = sqlx::query!(
                    "UPDATE youtube_streams SET start_time = $1 WHERE stream_id = $2",
                    start,
                    stream.id
                )
                .execute(&mut pool)
                .await?;
            }

            if let Some(end) = details.actual_end_time {
                let _ = sqlx::query!(
                    "UPDATE youtube_streams SET end_time = $1 WHERE stream_id = $2",
                    end,
                    stream.id
                )
                .execute(&mut pool)
                .await?;
            }

            if let Some(viewers) = &details.concurrent_viewers {
                let _ = sqlx::query!(
                    r#"
UPDATE statistics
SET data = array_append(data, ($1, $2)::statistic)
WHERE id = (
    SELECT viewer_statistics_id
    FROM youtube_streams
    WHERE stream_id = $3
)
                    "#,
                    now,
                    i32::from_str(&viewers).unwrap(),
                    stream.id
                )
                .execute(&mut pool)
                .await?;
            }
        }
    }

    println!(
        "Total: {} Skipped: {} Uppdated: {}",
        ids.len(),
        ids.len() - streams.items.len(),
        streams.items.len()
    );

    Ok(())
}
