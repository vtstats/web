mod error;
mod requests;
mod vtubers;

use chrono::{Timelike, Utc};
use sqlx::PgPool;

use crate::error::Result;
use crate::vtubers::VTUBERS;

#[tokio::main]
async fn main() -> Result<()> {
    let client = reqwest::Client::new();

    let mut pool = PgPool::new(env!("DATABASE_URL")).await?;

    let now = Utc::now();

    let bilibili_channels = requests::bilibili_channels(
        &client,
        VTUBERS.iter().flat_map(|v| v.bilibili).collect::<Vec<_>>(),
    )
    .await?;

    for channel in &bilibili_channels {
        if let Some(vtb) = VTUBERS.iter().find(|v| v.bilibili == Some(channel.id)) {
            let _ = sqlx::query!(
                r#"
update bilibili_channels
   set (subscriber_count, view_count, updated_at)
     = ($1, $2, $3)
 where vtuber_id = $4
                "#,
                channel.subscriber_count,
                channel.view_count,
                now,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
insert into bilibili_channel_subscriber_statistic (vtuber_id, time, value)
     values ($1, $2, $3)
                "#,
                vtb.name.to_string(),
                now,
                channel.subscriber_count
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
insert into bilibili_channel_view_statistic (vtuber_id, time, value)
     values ($1, $2, $3)
                "#,
                vtb.name.to_string(),
                now,
                channel.view_count
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

    for channel in &youtube_channels {
        if let Some(vtb) = VTUBERS.iter().find(|v| v.youtube == Some(&channel.id)) {
            let _ = sqlx::query!(
                r#"
update youtube_channels
   set (subscriber_count, view_count, updated_at)
     = ($1, $2, $3)
 where vtuber_id = $4
                "#,
                channel.subscriber_count,
                channel.view_count,
                now,
                vtb.name.to_string()
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
insert into youtube_channel_subscriber_statistic (vtuber_id, time, value)
     values ($1, $2, $3)
                "#,
                vtb.name.to_string(),
                now,
                channel.subscriber_count
            )
            .execute(&mut pool)
            .await?;

            let _ = sqlx::query!(
                r#"
insert into youtube_channel_view_statistic (vtuber_id, time, value)
     values ($1, $2, $3)
                "#,
                vtb.name.to_string(),
                now,
                channel.view_count
            )
            .execute(&mut pool)
            .await?;
        }
    }

    println!(
        "Bilibili Channels Uppdated: {} YouTube Channels Updated: {}",
        bilibili_channels.len(),
        youtube_channels.len()
    );

    Ok(())
}
