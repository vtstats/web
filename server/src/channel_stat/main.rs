#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;
#[path = "../vtubers.rs"]
mod vtubers;

use chrono::{DateTime, Utc};
use sqlx::PgPool;
use std::env;
use tracing::instrument;

use crate::error::Result;
use crate::requests::{Channel, RequestHub};
use crate::vtubers::{VTuber, VTUBERS};

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
    dotenv::dotenv().expect("Failed to load .env file");

    let hub = RequestHub::new();

    let pool = PgPool::connect(&env::var("DATABASE_URL").unwrap()).await?;

    let now = Utc::now();

    let ids = VTUBERS
        .iter()
        .filter_map(|v| v.bilibili)
        .collect::<Vec<_>>();

    let channels = hub.bilibili_channels(ids).await?;

    let channels = channels
        .into_iter()
        .filter_map(|ch| {
            VTUBERS
                .iter()
                .find(|vtb| vtb.bilibili == Some(&ch.id))
                .map(|vtb| (ch, vtb))
        })
        .collect::<Vec<_>>();

    update_bilibili_channels(&channels, now, &pool).await?;
    update_bilibili_channel_subscriber_statistic(&channels, now, &pool).await?;
    update_bilibili_channel_view_statistic(&channels, now, &pool).await?;

    let ids = VTUBERS.iter().filter_map(|v| v.youtube).collect::<Vec<_>>();

    let channels = hub.youtube_channels(ids).await?;

    let channels = channels
        .into_iter()
        .filter_map(|ch| {
            VTUBERS
                .iter()
                .find(|vtb| vtb.youtube == Some(&ch.id))
                .map(|vtb| (ch, vtb))
        })
        .collect::<Vec<_>>();

    update_youtube_channels(&channels, now, &pool).await?;
    update_youtube_channel_subscriber_statistic(&channels, now, &pool).await?;
    update_youtube_channel_view_statistic(&channels, now, &pool).await?;

    Ok(())
}

#[instrument(
    name = "Update bilibili channels",
    skip(pairs, now, pool),
    fields(db.table = "bilibili_channels")
)]
async fn update_bilibili_channels(
    pairs: &[(Channel, &VTuber)],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for (channel, vtuber) in pairs.iter() {
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
            vtuber.id,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(
    name = "Update bilibili channels subscriber statistic",
    skip(pairs, now, pool),
    fields(db.table = "bilibili_channel_subscriber_statistic")
)]
async fn update_bilibili_channel_subscriber_statistic(
    pairs: &[(Channel, &VTuber)],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for (channel, vtuber) in pairs.iter() {
        let _ = sqlx::query!(
            r#"
                insert into bilibili_channel_subscriber_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber.id,
            now,
            channel.subscriber_count,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(
    name = "Update bilibili channels view statistic",
    skip(pairs, now, pool),
    fields(db.table = "bilibili_channel_view_statistic")
)]
async fn update_bilibili_channel_view_statistic(
    pairs: &[(Channel, &VTuber)],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for (channel, vtuber) in pairs.iter() {
        let _ = sqlx::query!(
            r#"
                insert into bilibili_channel_view_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber.id,
            now,
            channel.view_count,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(
    name = "Update youtube channels",
    skip(pairs, now, pool),
    fields(db.table = "youtube_channels")
)]
async fn update_youtube_channels(
    pairs: &[(Channel, &VTuber)],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for (channel, vtuber) in pairs.iter() {
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
            vtuber.id,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(
    name = "Update youtube channels subscriber statistic",
    skip(pairs, now, pool),
    fields(db.table = "youtube_channel_subscriber_statistic")
)]
async fn update_youtube_channel_subscriber_statistic(
    pairs: &[(Channel, &VTuber)],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    for (channel, vtuber) in pairs.iter() {
        let _ = sqlx::query!(
            r#"
                insert into youtube_channel_subscriber_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber.id,
            now,
            channel.subscriber_count,
        )
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;

    Ok(())
}

#[instrument(
    name = "Update youtube channels view statistic",
    skip(pairs, now, pool),
    fields(db.table = "youtube_channel_view_statistic")
)]
async fn update_youtube_channel_view_statistic(
    pairs: &[(Channel, &VTuber)],
    now: DateTime<Utc>,
    pool: &PgPool,
) -> Result<()> {
    let mut tx = pool.begin().await?;
    let mut rows_affected = 0;

    for (channel, vtuber) in pairs.iter() {
        let done = sqlx::query!(
            r#"
                insert into youtube_channel_view_statistic (vtuber_id, time, value)
                     values ($1, $2, $3)
            "#,
            vtuber.id,
            now,
            channel.view_count,
        )
        .execute(&mut tx)
        .await?;
        rows_affected += done.rows_affected();
    }

    tx.commit().await?;

    tracing::info!(db.rows_affected = rows_affected);

    Ok(())
}
