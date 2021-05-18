#[path = "../config.rs"]
mod config;
#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;

use chrono::{DateTime, Utc};
use config::CONFIG;
use sqlx::PgPool;
use tracing::instrument;

use crate::error::Result;
use crate::requests::{Channel, RequestHub};

#[tokio::main]
async fn main() -> Result<()> {
    utils::init_logger();

    let _guard = utils::init_tracing("channel_stat", false);

    real_main().await
}

#[instrument(
    name = "channel_stat"
    fields(service.name = "holostats-cron")
)]
async fn real_main() -> Result<()> {
    let hub = RequestHub::new();

    let pool = PgPool::connect(&CONFIG.database.url).await?;

    let now = Utc::now();

    let ids = CONFIG
        .vtubers
        .iter()
        .filter_map(|v| v.bilibili.as_ref())
        .map(|id| id.as_str())
        .collect::<Vec<_>>();

    let channels = hub.bilibili_channels(ids).await?;

    update_bilibili_channels(&channels, now, &pool).await?;

    let ids = CONFIG
        .vtubers
        .iter()
        .filter_map(|v| v.youtube.as_ref())
        .map(|id| id.as_str())
        .collect::<Vec<_>>();

    let channels = hub.youtube_channels(ids).await?;

    update_youtube_channels(&channels, now, &pool).await?;

    Ok(())
}

#[instrument(name = "Update bilibili channels statistic", skip(channels, now, pool))]
async fn update_bilibili_channels(
    channels: &[Channel],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for channel in channels.iter() {
        let vtuber_id = match CONFIG.find_by_bilibili_channel_id(&channel.id) {
            Some(vtb) => &vtb.id,
            _ => continue,
        };

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
            vtuber_id,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
                insert into bilibili_channel_subscriber_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber_id,
            now,
            channel.subscriber_count,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
                insert into bilibili_channel_view_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber_id,
            now,
            channel.view_count,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(name = "Update youtube channels statistic", skip(channels, now, pool))]
async fn update_youtube_channels(
    channels: &[Channel],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for channel in channels.iter() {
        let vtuber_id = match CONFIG.find_by_youtube_channel_id(&channel.id) {
            Some(vtb) => &vtb.id,
            _ => continue,
        };

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
            vtuber_id,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
                insert into youtube_channel_subscriber_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber_id,
            now,
            channel.subscriber_count,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
                insert into youtube_channel_view_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber_id,
            now,
            channel.view_count,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}
