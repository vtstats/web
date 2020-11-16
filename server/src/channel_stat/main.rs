#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../trace.rs"]
mod trace;
#[path = "../vtubers.rs"]
mod vtubers;

use chrono::{DateTime, Utc};
use reqwest::Client;
use sqlx::PgPool;
use std::env;
use tracing_appender::rolling::Rotation;

use crate::error::Result;
use crate::vtubers::VTUBERS;

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = trace::init("channel_stat=debug", Rotation::DAILY);

    let _span = tracing::info_span!("channel_stat");

    let client = reqwest::Client::new();

    let pool = PgPool::connect(&env::var("DATABASE_URL").unwrap()).await?;

    let now = Utc::now();

    bilibili_channels_stat(now, &client, &pool).await?;

    youtube_channels_stat(now, &client, &pool).await?;

    Ok(())
}

async fn bilibili_channels_stat(now: DateTime<Utc>, client: &Client, pool: &PgPool) -> Result<()> {
    let ids = VTUBERS
        .iter()
        .filter_map(|v| v.bilibili)
        .collect::<Vec<_>>();

    let span = tracing::debug_span!("bilibili_channels_stat", len = ids.len(), ids = ?ids);

    let channels = requests::bilibili_channels(&client, ids).await?;

    tracing::debug!(parent: span, len = channels.len(), channels = ?channels);

    for channel in &channels {
        if let Some(vtb) = VTUBERS.iter().find(|v| v.bilibili == Some(&channel.id)) {
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
                vtb.id,
            )
            .execute(pool)
            .await?;

            let _ = sqlx::query!(
                r#"
                    insert into bilibili_channel_subscriber_statistic (vtuber_id, time, value)
                         values ($1, $2, $3)
                "#,
                vtb.id,
                now,
                channel.subscriber_count,
            )
            .execute(pool)
            .await?;

            let _ = sqlx::query!(
                r#"
                    insert into bilibili_channel_view_statistic (vtuber_id, time, value)
                         values ($1, $2, $3)
                "#,
                vtb.id,
                now,
                channel.view_count,
            )
            .execute(pool)
            .await?;
        }
    }

    Ok(())
}

async fn youtube_channels_stat(now: DateTime<Utc>, client: &Client, pool: &PgPool) -> Result<()> {
    let ids = VTUBERS.iter().filter_map(|v| v.youtube).collect::<Vec<_>>();

    let span = tracing::debug_span!("youtube_channels_stat", len = ids.len(), ids = ?ids);

    let channels = requests::youtube_channels(&client, ids).await?;

    tracing::debug!(parent: span, len = channels.len(), channels = ?channels);

    for channel in &channels {
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
                vtb.id,
            )
            .execute(pool)
            .await?;

            let _ = sqlx::query!(
                r#"
                    insert into youtube_channel_subscriber_statistic (vtuber_id, time, value)
                         values ($1, $2, $3)
                "#,
                vtb.id,
                now,
                channel.subscriber_count,
            )
            .execute(pool)
            .await?;

            let _ = sqlx::query!(
                r#"
                    insert into youtube_channel_view_statistic (vtuber_id, time, value)
                         values ($1, $2, $3)
                "#,
                vtb.id,
                now,
                channel.view_count,
            )
            .execute(pool)
            .await?;
        }
    }

    Ok(())
}
