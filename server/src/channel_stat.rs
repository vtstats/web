mod consts;
mod error;
mod requests;

use chrono::{Timelike, Utc};
use sqlx::PgPool;

use crate::consts::VTUBERS;
use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let client = reqwest::Client::new();

    let now = Utc::now();
    let bilibili_channels = requests::bilibili_channels(
        &client,
        VTUBERS.iter().flat_map(|v| v.bilibili).collect::<Vec<_>>(),
    )
    .await?;

    let mut pool = PgPool::new(env!("DATABASE_URL")).await?;

    for channel in bilibili_channels {
        if let Some(vtb) = VTUBERS.iter().find(|v| v.bilibili == Some(channel.id)) {
            let _ = sqlx::query!(
                "UPDATE bilibili_channels SET subscriber_count = $1, view_count = $2 WHERE vtuber_id = $3",
                channel.subscriber_count,
                channel.view_count,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
UPDATE statistics
SET data = array_append(data, ($1, $2)::statistic)
WHERE id = (
    SELECT subscriber_statistics_id
    FROM bilibili_channels
    WHERE vtuber_id = $3
)
                "#,
                now,
                channel.subscriber_count,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
UPDATE statistics
SET data = array_append(data, ($1, $2)::statistic)
WHERE id = (
    SELECT view_statistics_id
    FROM bilibili_channels
    WHERE vtuber_id = $3
)
                "#,
                now,
                channel.view_count,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;
        }
    }

    let youtube_channels = requests::youtube_channels(
        &client,
        VTUBERS.iter().flat_map(|v| v.youtube).collect::<Vec<_>>(),
        if now.hour() % 2 == 0 {
            env!("YOUTUBE_API_KEY0")
        } else {
            env!("YOUTUBE_API_KEY1")
        },
    )
    .await?;

    for channel in youtube_channels {
        if let Some(vtb) = VTUBERS.iter().find(|v| v.youtube == Some(&channel.id)) {
            let _ = sqlx::query!(
                "UPDATE youtube_channels SET subscriber_count = $1, view_count = $2 WHERE vtuber_id = $3",
                channel.subscriber_count,
                channel.view_count,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
UPDATE statistics
SET data = array_append(data, ($1, $2)::statistic)
WHERE id = (
    SELECT subscriber_statistics_id
    FROM youtube_channels
    WHERE vtuber_id = $3
)
                "#,
                now,
                channel.subscriber_count,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
UPDATE statistics
SET data = array_append(data, ($1, $2)::statistic)
WHERE id = (
    SELECT view_statistics_id
    FROM youtube_channels
    WHERE vtuber_id = $3
)
                "#,
                now,
                channel.view_count,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;
        }
    }

    Ok(())
}
